const Medicine = require('../models/Medicine');

// @desc    Get all medicines for logged in user
// @route   GET /api/medicines
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new medicine
// @route   POST /api/medicines
// @access  Private
const addMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, times } = req.body;

    const medicine = new Medicine({
      userId: req.user._id,
      name,
      dosage,
      frequency,
      times, // 2.0 now supports multiple times per entry
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine && medicine.userId.toString() === req.user._id.toString()) {
      await medicine.deleteOne();
      res.json({ message: 'Medicine removed' });
    } else {
      res.status(404).json({ message: 'Medicine not found or access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark medicine as taken
// @route   POST /api/medicines/:id/take
// @access  Private/Public (Public for Service Workers)
const takeMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    const { userId } = req.body; // Allow userId from body for SW fallback

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Allow if authenticated OR if correct userId is provided in body (for background SW calls)
    const authorized = (req.user && medicine.userId.toString() === req.user._id.toString()) || 
                       (userId && medicine.userId.toString() === userId.toString());

    if (authorized) {
      medicine.lastTaken = new Date();
      medicine.status = 'taken';
      await medicine.save();
      
      console.log(`[ACTION] -> Medicine: ${medicine.name} marked as taken.`);
      res.json({ message: 'Medicine marked as taken' });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMedicines, addMedicine, deleteMedicine, takeMedicine };
