import * as machineRepo from '../repositories/machine.repository.js';
import { IMachine } from '../models/machine.model.js';
import Booking from '../models/booking.model.js';
import mongoose from 'mongoose';

export const checkAvailability = async (
  machineId: string,
  startDate: string,
  endDate: string,
  quantity: number
): Promise<any> => {
  const machine = await machineRepo.getMachineById(machineId);
  if (!machine) throw new Error('Machine not found');

  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappingBookings = await Booking.find({
    machine: new mongoose.Types.ObjectId(machineId),
    $or: [
      { status: 'confirmed' },
      { 
        status: 'pending', 
        $or: [
          { holdExpiresAt: { $exists: false } },
          { holdExpiresAt: { $gt: new Date() } }
        ]
      }
    ],
    startDate: { $lte: end }, 
    endDate: { $gte: start }
  });

  const timePoints = new Set<number>();
  timePoints.add(start.getTime());
  timePoints.add(end.getTime());
  overlappingBookings.forEach(b => {
    timePoints.add(new Date(b.startDate).getTime());
    timePoints.add(new Date(b.endDate).getTime());
  });

  const sortedPoints = Array.from(timePoints).sort((a, b) => a - b);
  let maxUsed = 0;

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const intervalStart = new Date(sortedPoints[i]);
    const intervalEnd = new Date(sortedPoints[i + 1]);

    if (intervalEnd <= start || intervalStart >= end) continue;

    const usage = overlappingBookings
      .filter(b => {
        const bStart = new Date(b.startDate);
        const bEnd = new Date(b.endDate);
        return bStart < intervalEnd && bEnd > intervalStart;
      })
      .reduce((sum, b) => sum + b.quantity, 0);

    if (usage > maxUsed) maxUsed = usage;
  }

  const availableQty = (machine.quantity || 0) - maxUsed;

  let nextAvailableDate = null;
  if (availableQty < quantity) {
    const durationMs = end.getTime() - start.getTime();
    const maxFutureScan = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    // Heuristic: check after each existing booking's end date
    const checkPoints = overlappingBookings
      .map(b => new Date(new Date(b.endDate).getTime() + 24 * 60 * 60 * 1000))
      .filter(d => d > start && d < maxFutureScan)
      .sort((a, b) => a.getTime() - b.getTime());

    for (const pStart of checkPoints) {
      const pEnd = new Date(pStart.getTime() + durationMs);
      
      // Simple non-recursive check for this candidate point
      const pOverlaps = await Booking.find({
        machine: new mongoose.Types.ObjectId(machineId),
        status: { $in: ['pending', 'confirmed'] },
        $or: [{ startDate: { $lte: pEnd }, endDate: { $gte: pStart } }]
      });

      // Calculate max usage for this candidate start date
      const pPoints = new Set<number>([pStart.getTime(), pEnd.getTime()]);
      pOverlaps.forEach(b => {
        pPoints.add(new Date(b.startDate).getTime());
        pPoints.add(new Date(b.endDate).getTime());
      });
      const sPPoints = Array.from(pPoints).sort((a, b) => a - b);
      let pMaxUsed = 0;

      for (let j = 0; j < sPPoints.length - 1; j++) {
        const iS = new Date(sPPoints[j]);
        const iE = new Date(sPPoints[j+1]);
        if (iE <= pStart || iS >= pEnd) continue;
        const u = pOverlaps
          .filter(b => new Date(b.startDate) < iE && new Date(b.endDate) > iS)
          .reduce((sum, b) => sum + b.quantity, 0);
        if (u > pMaxUsed) pMaxUsed = u;
      }

      if ((machine.quantity || 0) - pMaxUsed >= quantity) {
        nextAvailableDate = pStart;
        break;
      }
    }
  }

  return {
    availableQty: Math.max(0, availableQty),
    requestedQty: quantity,
    isAvailable: availableQty >= quantity,
    nextAvailableDate,
  };
};

export const createMachine = async (sellerId: string, data: Partial<IMachine>) => {
  const machineData: Partial<IMachine> = {
    seller: new mongoose.Types.ObjectId(sellerId),

    machineName: data.machineName,
    category: data.category,

    brandModel: data.brandModel,
    yearOfManufacture: data.yearOfManufacture,
    condition: data.condition,
    machineCapacityHP: data.machineCapacityHP,
    fuelType: data.fuelType,
    description: data.description,

    pricing: data.pricing,
    operator: data.operator,
    transport: data.transport,
    wizardStep: data.wizardStep || 1,
  };

  if (data.location) {
    machineData.location = {
      address: data.location.address,
      village: data.location.village,
      district: data.location.district,
      state: data.location.state,
      pincode: data.location.pincode,
    };

    if (
      data.location.coordinates &&
      Array.isArray(data.location.coordinates) &&
      data.location.coordinates.length === 2
    ) {
      machineData.location.type = 'Point';
      machineData.location.coordinates = data.location.coordinates;
    }
  }

  return machineRepo.createMachine(machineData);
};

export const getAllMachines = async () => {
  return machineRepo.getAllMachines();
};

export const getMachineById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid machine ID');
  }

  const machine = await machineRepo.getMachineById(id);

  if (!machine) {
    throw new Error('Machine not found');
  }

  return machine;
};

export const getMachineBySlug = async (slug: string) => {
  const machine = await machineRepo.getMachineBySlug(slug);

  if (!machine) {
    throw new Error('Machine not found');
  }

  return machine;
};

export const updateMachine = async (id: string, data: Partial<IMachine>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid machine ID');
  }

  const machine = await machineRepo.getMachineById(id);

  if (!machine) {
    throw new Error('Machine not found');
  }

  const { pricing, location, operator, transport, ...otherData } = data;

  Object.assign(machine, otherData);

  if (pricing) {
    const currentPricing =
      machine.pricing && typeof (machine.pricing as any).toObject === 'function'
        ? (machine.pricing as any).toObject()
        : machine.pricing || {};
    machine.pricing = { ...currentPricing, ...pricing } as Record<string, unknown> as any;
  }

  if (location) {
    const currentLoc =
      machine.location && typeof (machine.location as any).toObject === 'function'
        ? (machine.location as any).toObject()
        : machine.location || {};
    const newLocation = { ...currentLoc, ...location };

    if (
      newLocation.coordinates &&
      Array.isArray(newLocation.coordinates) &&
      newLocation.coordinates.length === 2
    ) {
      newLocation.type = 'Point';
    } else {
      newLocation.type = undefined;
    }
    machine.location = newLocation as Record<string, unknown> as any;
  }

  if (operator) {
    const currentOp =
      machine.operator && typeof (machine.operator as any).toObject === 'function'
        ? (machine.operator as any).toObject()
        : machine.operator || {};
    machine.operator = { ...currentOp, ...operator } as Record<string, unknown> as any;
  }

  if (transport) {
    const currentTrans =
      machine.transport && typeof (machine.transport as any).toObject === 'function'
        ? (machine.transport as any).toObject()
        : machine.transport || {};
    machine.transport = { ...currentTrans, ...transport } as Record<string, unknown> as any;
  }

  await machine.save();

  return machine;
};

export const deleteMachine = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid machine ID');
  }

  const machine = await machineRepo.deleteMachine(id);

  if (!machine) {
    throw new Error('Machine not found');
  }

  return machine;
};

export const getSellerMachines = async (sellerId: string) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new Error('Invalid seller ID');
  }

  return machineRepo.getMachinesBySeller(sellerId);
};

export const getMachinesByCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }

  return machineRepo.getMachinesByCategory(categoryId);
};

export const decrementQuantity = async (id: string, amount: number) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid machine ID');
  }

  const result = await Machine.findOneAndUpdate(
    { _id: id, quantity: { $gte: amount } },
    { $inc: { quantity: -amount } },
    { new: true }
  );

  if (!result) {
    throw new Error('Insufficient quantity or machine not found');
  }

  return result;
};

export const getUniqueLocations = async () => {
  return machineRepo.getUniqueLocations();
};
