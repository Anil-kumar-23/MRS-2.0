const express = require('express');
const router = express.Router();
const { getMedicines, addMedicine, deleteMedicine, takeMedicine } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMedicines)
  .post(protect, addMedicine);

router.route('/:id')
  .delete(protect, deleteMedicine);

router.route('/:id/take')
  .post(takeMedicine); // No protect for background/SW calls, security handled in controller

module.exports = router;
