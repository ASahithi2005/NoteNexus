import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
mentorName: { type: String, required: true },
color: { type: String, required: true },
colorName: { type: String, required: true },
studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]
});

const Course = mongoose.model("Course", courseSchema);
export default Course;

