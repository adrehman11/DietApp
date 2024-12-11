const mongoose = require('mongoose');
const { DietApp } = require('../utility/connection');

// General Form Schema
const GeneralFormSchema = new mongoose.Schema({
    gender: { type: String, default: null },
    height: { type: String, default: null },
    weight: { type: String, default: null },
    age: { type: String, default: null },
    bodyImages: { type: Array, default: null },
    profession: { type: String, default: null },
    Regular_activity: { type: String, default: null },
    health_problems: { type: Boolean, default: false },
    medical_analysis: { type: String, default: null },
    listOfMedicationTaken: { type: String, default: null },
    injuries_surgeries: { type: String, default: null },
    form_Type: { type: String, default: null },
});

// Diet Form Schema
const DietFormSchema = new mongoose.Schema({
    joining_target: { type: String, default: null },
    smoking: { type: String, default: null },
    dieting_before: { type: String, default: null },
    family_support_idea: { type: String, default: null },
    past_experience_diet: { type: String, default: null },
    dont_like_food: { type: Array, default: null },
    meals_in_a_day: { type: String, default: null },
    meals_in_a_diet: { type: String, default: null },
    budget_for_diet: { type: String, default: null },
    rate_appetite: { type: String, default: null },
    use_vitamins_minerals: { type: String, default: null },
    nutritional_supplements: { type: String, default: null },
    form_Type: { type: String, default: null },
});

// Workout Form Schema
const WorkoutFormSchema = new mongoose.Schema({
    activity_level: { type: String, default: null },
    any_injuries: { type: String, default: null },
    MRI_XRAY_CT: { type: String, default: null },
    MRI_XRAY_CT_Details: { type: String, default: null },
    resistance_training: { type: String, default: null },
    workout_place: { type: String, default: null },
    available_tools_home: { type: String, default: null },
    available_days_exercise: { type: String, default: null },
    experience_exercise_regimens: { type: String, default: null },
    dont_like_exercise: { type: Array, default: null },
    where_to_do_workout: { type: String, default: null },
    daily_steps: { type: String, default: null },
    previous_experience_online_coaching: { type: String, default: null },
    why_did_subscribe: { type: String, default: null },
    notes: { type: String, default: null },
    form_Type: { type: String, default: null },
});

// Main Form Schema
const FormSchema = new mongoose.Schema(
    {
        // Embed General, Diet, and Workout forms as nested objects
        generalForm: { type: GeneralFormSchema, default: () => ({}) },
        dietForm: { type: DietFormSchema, default: () => ({}) },
        workoutForm: { type: WorkoutFormSchema, default: () => ({}) },

        // Other fields
        form_status: { type: String, default: null },
        client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Form = DietApp.model('Form', FormSchema);
module.exports = {
    Form,
};
