
const { FoodItem } = require('../../models/foodItem_model')
const mongoose = require('mongoose');

exports.getAllcoach = async function (req, res) {
    try {

        const page = req.body.page || 1;
        const pageSize = req.body.pageSize || 10;
        const searchFilter = req.body.search
            ? { full_name: { $regex: req.body.search, $options: "i" } }
            : {};

        let query = FoodItem.find(searchFilter);

        // Apply pagination only if search is NOT provided
        if (!req.body.search) {
            const skip = (page - 1) * pageSize;
            query = query.skip(skip).limit(pageSize);
        }
        return res.status(200).json({ message: "Food Item Added" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }




}
