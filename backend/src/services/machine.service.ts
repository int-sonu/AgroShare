import * as machineRepo from '../repositories/machine.repository.js';
import { IMachine } from '../models/machine.model.js';
import mongoose from 'mongoose';

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
    machine.pricing = {
      ...(machine.pricing &&
      typeof (machine.pricing as { toObject?: () => Record<string, unknown> }).toObject ===
        'function'
        ? (machine.pricing as { toObject: () => Record<string, unknown> }).toObject()
        : {}),
      ...pricing,
    } as IMachine['pricing'];
  }

  if (location) {
    const existingLocation =
      machine.location && 'toObject' in machine.location
        ? (machine.location as { toObject: () => Record<string, unknown> }).toObject()
        : {};
    const newLocation = {
      ...existingLocation,
      ...location,
    };

    if (
      newLocation.coordinates &&
      Array.isArray(newLocation.coordinates) &&
      newLocation.coordinates.length === 2
    ) {
      newLocation.type = 'Point';
    } else {
      newLocation.type = undefined;
    }

    machine.location = newLocation;
  }

  machine.operator = {
    ...(machine.operator &&
    typeof (machine.operator as { toObject?: () => Record<string, unknown> }).toObject ===
      'function'
      ? (machine.operator as { toObject: () => Record<string, unknown> }).toObject()
      : {}),
    ...operator,
  } as IMachine['operator'];

  if (transport) {
    machine.transport = {
      ...(machine.transport &&
      typeof (machine.transport as { toObject?: () => Record<string, unknown> }).toObject ===
        'function'
        ? (machine.transport as { toObject: () => Record<string, unknown> }).toObject()
        : {}),
      ...transport,
    } as IMachine['transport'];
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

export const getUniqueLocations = async () => {
  return machineRepo.getUniqueLocations();
};
