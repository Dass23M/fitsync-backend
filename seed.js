const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Workout = require("./models/Workout");
const Plan = require("./models/Plan");
const Activity = require("./models/Activity");

const users = [
  { name: "Alex Johnson", email: "alex@fitsync.com", password: "demo123", role: "user", bio: "Running enthusiast and gym rat. 5 days a week grind." },
  { name: "Sarah Williams", email: "sarah@fitsync.com", password: "demo123", role: "user", bio: "CrossFit lover. Always chasing PRs." },
  { name: "Mike Chen", email: "mike@fitsync.com", password: "demo123", role: "user", bio: "Powerlifter in training. Squat is life." },
  { name: "Emma Davis", email: "emma@fitsync.com", password: "demo123", role: "user", bio: "Yoga and HIIT. Balance is everything." },
  { name: "Jordan Smith", email: "jordan@fitsync.com", password: "demo123", role: "user", bio: "Basketball player keeping fit in offseason." },
  { name: "Priya Patel", email: "priya@fitsync.com", password: "demo123", role: "user", bio: "Marathon runner and healthy eating advocate." },
  { name: "Chris Brown", email: "chris@fitsync.com", password: "demo123", role: "user", bio: "Bodybuilder. Consistency over intensity." },
  { name: "Mia Thompson", email: "mia@fitsync.com", password: "demo123", role: "user", bio: "New to fitness. Loving every step of the journey." },
  { name: "Liam Wilson", email: "liam@fitsync.com", password: "demo123", role: "user", bio: "Rock climber and functional fitness fan." },
  { name: "Zoe Martinez", email: "zoe@fitsync.com", password: "demo123", role: "user", bio: "Swimmer turned gym enthusiast." },
  { name: "Coach Ryan", email: "ryan@fitsync.com", password: "demo123", role: "coach", bio: "NSCA certified strength coach. 10 years experience. Specializing in powerlifting and athletic conditioning." },
  { name: "Coach Lisa", email: "lisa@fitsync.com", password: "demo123", role: "coach", bio: "NASM certified personal trainer. Specializing in weight loss and functional movement." },
  { name: "Coach Marcus", email: "marcus@fitsync.com", password: "demo123", role: "coach", bio: "Former D1 athlete. Now helping others reach their peak performance." },
  { name: "Coach Aisha", email: "aisha@fitsync.com", password: "demo123", role: "coach", bio: "CrossFit Level 2 trainer. Mobility and strength specialist." },
  { name: "Coach Tom", email: "tom@fitsync.com", password: "demo123", role: "coach", bio: "Sports performance coach. 8 years working with professional athletes." },
  { name: "Demo Athlete", email: "athlete@demo.com", password: "demo123", role: "user", bio: "Demo athlete account. Try all features!" },
  { name: "Demo Coach", email: "coach@demo.com", password: "demo123", role: "coach", bio: "Demo coach account. Create plans and manage athletes!" },
  { name: "Tyler Brooks", email: "tyler@fitsync.com", password: "demo123", role: "user", bio: "HIIT and cycling. Always sweating." },
  { name: "Nina Rose", email: "nina@fitsync.com", password: "demo123", role: "user", bio: "Pilates instructor turned gym member." },
  { name: "Sam Park", email: "sam@fitsync.com", password: "demo123", role: "user", bio: "Calisthenics and street workout lover." },
];

const workoutTemplates = [
  {
    title: "Morning Push Day",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 80, unit: "kg", notes: "Focus on chest contraction" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 30, unit: "kg", notes: "" },
      { name: "Overhead Press", sets: 3, reps: 10, weight: 50, unit: "kg", notes: "" },
      { name: "Lateral Raises", sets: 3, reps: 15, weight: 12, unit: "kg", notes: "" },
      { name: "Tricep Pushdowns", sets: 3, reps: 12, weight: 25, unit: "kg", notes: "" },
    ],
    muscleGroups: ["chest", "shoulders", "arms"],
    difficulty: "intermediate",
    duration: 55,
    notes: "Progressive overload — increase weight by 2.5kg next session",
  },
  {
    title: "Leg Day Destroyer",
    exercises: [
      { name: "Back Squat", sets: 5, reps: 5, weight: 100, unit: "kg", notes: "Belt on for heavy sets" },
      { name: "Romanian Deadlift", sets: 4, reps: 8, weight: 80, unit: "kg", notes: "" },
      { name: "Leg Press", sets: 3, reps: 12, weight: 150, unit: "kg", notes: "" },
      { name: "Leg Curl", sets: 3, reps: 12, weight: 40, unit: "kg", notes: "" },
      { name: "Calf Raises", sets: 4, reps: 20, weight: 60, unit: "kg", notes: "" },
    ],
    muscleGroups: ["legs"],
    difficulty: "advanced",
    duration: 70,
    notes: "Rest 3 mins between squat sets",
  },
  {
    title: "Pull Day — Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: 4, reps: 6, weight: 120, unit: "kg", notes: "Conventional stance" },
      { name: "Barbell Row", sets: 4, reps: 8, weight: 70, unit: "kg", notes: "" },
      { name: "Pull Ups", sets: 3, reps: 8, weight: 0, unit: "kg", notes: "Bodyweight" },
      { name: "Cable Row", sets: 3, reps: 12, weight: 60, unit: "kg", notes: "" },
      { name: "Barbell Curl", sets: 3, reps: 12, weight: 30, unit: "kg", notes: "" },
    ],
    muscleGroups: ["back", "arms"],
    difficulty: "intermediate",
    duration: 60,
    notes: "",
  },
  {
    title: "Full Body HIIT",
    exercises: [
      { name: "Burpees", sets: 4, reps: 15, weight: 0, unit: "kg", notes: "30 sec rest between sets" },
      { name: "Box Jumps", sets: 4, reps: 10, weight: 0, unit: "kg", notes: "" },
      { name: "Kettlebell Swings", sets: 4, reps: 20, weight: 20, unit: "kg", notes: "" },
      { name: "Mountain Climbers", sets: 3, reps: 30, weight: 0, unit: "kg", notes: "" },
      { name: "Battle Ropes", sets: 3, reps: 20, weight: 0, unit: "kg", notes: "20 sec on 10 sec off" },
    ],
    muscleGroups: ["full body", "cardio"],
    difficulty: "advanced",
    duration: 40,
    notes: "Keep heart rate above 75% max throughout",
  },
  {
    title: "Beginner Full Body",
    exercises: [
      { name: "Goblet Squat", sets: 3, reps: 12, weight: 16, unit: "kg", notes: "" },
      { name: "Dumbbell Row", sets: 3, reps: 10, weight: 20, unit: "kg", notes: "" },
      { name: "Push Ups", sets: 3, reps: 10, weight: 0, unit: "kg", notes: "Bodyweight" },
      { name: "Dumbbell Lunges", sets: 3, reps: 10, weight: 12, unit: "kg", notes: "" },
      { name: "Plank", sets: 3, reps: 1, weight: 0, unit: "kg", notes: "Hold 30 seconds" },
    ],
    muscleGroups: ["full body"],
    difficulty: "beginner",
    duration: 35,
    notes: "Perfect for first time gym goers",
  },
  {
    title: "Core Blast",
    exercises: [
      { name: "Cable Crunch", sets: 4, reps: 15, weight: 40, unit: "kg", notes: "" },
      { name: "Hanging Leg Raise", sets: 4, reps: 12, weight: 0, unit: "kg", notes: "" },
      { name: "Russian Twist", sets: 3, reps: 20, weight: 10, unit: "kg", notes: "" },
      { name: "Ab Wheel Rollout", sets: 3, reps: 10, weight: 0, unit: "kg", notes: "" },
      { name: "Side Plank", sets: 3, reps: 1, weight: 0, unit: "kg", notes: "45 sec each side" },
    ],
    muscleGroups: ["core"],
    difficulty: "intermediate",
    duration: 30,
    notes: "",
  },
  {
    title: "Shoulder Sculpt",
    exercises: [
      { name: "Seated Dumbbell Press", sets: 4, reps: 10, weight: 24, unit: "kg", notes: "" },
      { name: "Arnold Press", sets: 3, reps: 12, weight: 18, unit: "kg", notes: "" },
      { name: "Front Raise", sets: 3, reps: 12, weight: 10, unit: "kg", notes: "" },
      { name: "Lateral Raise", sets: 4, reps: 15, weight: 10, unit: "kg", notes: "" },
      { name: "Rear Delt Fly", sets: 3, reps: 15, weight: 8, unit: "kg", notes: "" },
    ],
    muscleGroups: ["shoulders"],
    difficulty: "intermediate",
    duration: 45,
    notes: "",
  },
  {
    title: "Cardio Endurance Run",
    exercises: [
      { name: "Treadmill Run", sets: 1, reps: 1, weight: 0, unit: "kg", notes: "5km steady pace" },
      { name: "Incline Walk", sets: 1, reps: 1, weight: 0, unit: "kg", notes: "10 mins cooldown" },
    ],
    muscleGroups: ["cardio", "legs"],
    difficulty: "beginner",
    duration: 45,
    notes: "Maintained 5:30/km pace",
  },
];

const planTemplates = [
  {
    title: "12-Week Powerlifting Program",
    description: "A structured powerlifting program focusing on the big three — squat, bench and deadlift. Designed for intermediate lifters looking to hit new PRs.",
    difficulty: "advanced",
    durationWeeks: 12,
  },
  {
    title: "8-Week Fat Loss Transformation",
    description: "Combination of strength training and cardio to maximize fat loss while preserving muscle. Includes nutrition guidelines.",
    difficulty: "intermediate",
    durationWeeks: 8,
  },
  {
    title: "6-Week Beginner Starter Pack",
    description: "Perfect for gym newbies. Full body workouts 3 days per week with clear progression. Build a solid foundation.",
    difficulty: "beginner",
    durationWeeks: 6,
  },
  {
    title: "10-Week Athletic Performance",
    description: "Sport-specific training to improve speed, power and agility. Used by professional and collegiate athletes.",
    difficulty: "advanced",
    durationWeeks: 10,
  },
  {
    title: "4-Week Core & Mobility Reset",
    description: "Focus on building core strength and improving mobility. Great for injury prevention and posture correction.",
    difficulty: "beginner",
    durationWeeks: 4,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Plan.deleteMany({});
    await Activity.deleteMany({});
    console.log("Existing data cleared");

    console.log("Creating users...");
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    const athletes = createdUsers.filter((u) => u.role === "user");
    const coaches = createdUsers.filter((u) => u.role === "coach");

    console.log("Setting up follows...");
    for (const athlete of athletes) {
      const randomCoaches = coaches
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const randomAthletes = athletes
        .filter((a) => a._id.toString() !== athlete._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const toFollow = [...randomCoaches, ...randomAthletes];

      await User.findByIdAndUpdate(athlete._id, {
        $set: { following: toFollow.map((u) => u._id) },
      });

      for (const followed of toFollow) {
        await User.findByIdAndUpdate(followed._id, {
          $addToSet: { followers: athlete._id },
        });
      }
    }
    console.log("Follows set up");

    console.log("Creating workouts...");
    const createdWorkouts = [];
    for (const athlete of athletes) {
      const numWorkouts = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numWorkouts; i++) {
        const template =
          workoutTemplates[Math.floor(Math.random() * workoutTemplates.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const workoutDate = new Date();
        workoutDate.setDate(workoutDate.getDate() - daysAgo);

        const workout = await Workout.create({
          user: athlete._id,
          title: template.title,
          exercises: template.exercises,
          muscleGroups: template.muscleGroups,
          difficulty: template.difficulty,
          duration: template.duration,
          notes: template.notes,
          createdAt: workoutDate,
        });
        createdWorkouts.push(workout);

        await Activity.create({
          user: athlete._id,
          type: "workout_logged",
          workout: workout._id,
          createdAt: workoutDate,
        });
      }
    }
    console.log(`Created ${createdWorkouts.length} workouts`);

    console.log("Creating plans...");
    const createdPlans = [];
    for (let i = 0; i < planTemplates.length; i++) {
      const coach = coaches[i % coaches.length];
      const template = planTemplates[i];

      const planWorkouts = createdWorkouts
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map((w) => w._id);

      const subscribers = athletes
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 2)
        .map((a) => a._id);

      const plan = await Plan.create({
        coach: coach._id,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        durationWeeks: template.durationWeeks,
        workouts: planWorkouts,
        subscribers,
      });
      createdPlans.push(plan);

      await Activity.create({
        user: coach._id,
        type: "plan_created",
        plan: plan._id,
      });

      console.log(`Created plan: ${plan.title} by ${coach.name}`);
    }

    console.log("Creating follow activities...");
    for (const athlete of athletes.slice(0, 8)) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      if (randomUser._id.toString() !== athlete._id.toString()) {
        await Activity.create({
          user: athlete._id,
          type: "user_followed",
          targetUser: randomUser._id,
        });
      }
    }

    console.log("\n===== SEED COMPLETE =====");
    console.log(`Users created:    ${createdUsers.length}`);
    console.log(`Athletes:         ${athletes.length}`);
    console.log(`Coaches:          ${coaches.length}`);
    console.log(`Workouts created: ${createdWorkouts.length}`);
    console.log(`Plans created:    ${createdPlans.length}`);
    console.log("\n===== LOGIN CREDENTIALS =====");
    console.log("Demo Athlete:  athlete@demo.com  /  demo123");
    console.log("Demo Coach:    coach@demo.com    /  demo123");
    console.log("Any user:      [email]           /  demo123");
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seed();