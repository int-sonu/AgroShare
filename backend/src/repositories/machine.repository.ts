import Machine, { IMachine } from '../models/machine.model.js';

export const createMachine = async (data: Partial<IMachine>) => {
  return Machine.create(data);
};

export const getAllMachines = async () => {
  const machines = await Machine.find().populate({
    path: 'category',
    match: { status: { $ne: 'inactive' } }
  });
  return machines.filter((machine) => machine.category !== null);
};

export const getMachineById = async (id: string) => {
  return Machine.findById(id).populate('category').populate('seller', 'name email phone');
};

export const getMachineBySlug = async (slug: string) => {
  return Machine.findOne({ slug }).populate('category').populate('seller', 'name email phone');
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

export const getMachinesByCategory = async (categoryId: string) => {
  return Machine.find({ category: categoryId })
    .populate('category')
    .populate('seller', 'name email phone');
};

export const getUniqueLocations = async () => {
  return Machine.aggregate([
    {
      $group: {
        _id: { district: '$location.district', state: '$location.state' },
      },
    },
    {
      $project: {
        _id: 0,
        district: '$_id.district',
        state: '$_id.state',
      },
    },
    { $sort: { state: 1, district: 1 } },
  ]);
};
