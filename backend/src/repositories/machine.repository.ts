import Machine, { IMachine } from '../models/machine.model.js';

export const createMachine = async (data: Partial<IMachine>) => {
  return Machine.create(data);
};

export const getAllMachines = async () => {
  return Machine.find().populate('category');
};

export const getMachineById = async (id: string) => {
  return Machine.findById(id).populate('category');
};

export const updateMachine = async (id: string, data: Partial<IMachine>) => {
  return Machine.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMachine = async (id: string) => {
  return Machine.findByIdAndDelete(id);
};

export const getMachinesBySeller = async (sellerId: string) => {
  return Machine.find({ seller: sellerId }).populate('category');
};
