import taskData from "../models/taskModel.js";
import User from "../models/userModel.js";

// A task is visible to admins of its organization and to the user it is assigned to
const canAccess = (task, user) => task.organization_id === String(user.organization) && (user.isAdmin || task.user_id === String(user._id));

// The assignee must belong to the same organization as the admin
const assigneeInOrg = async (user_id, organization) => {
  return User.exists({ _id: user_id, organization });
};

export const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await taskData.findById(id);
    if (!task || !canAccess(task, req.user)) {
      return res.status(404).json({ error: "No Such Task" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin only
export const createTask = async (req, res) => {
  const { taskName, user_id, due_date, priority, isComplete, notes } = req.body;

  try {
    if (!(await assigneeInOrg(user_id, req.user.organization))) {
      return res.status(400).json({ error: "Assigned user not found in your organization" });
    }

    const newTask = new taskData({ taskName, organization_id: req.user.organization, user_id, due_date, priority, isComplete, notes });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message, error: error.message });
  }
};

// Admin only
export const deleteTask = async (req, res) => {
  const id = req.params.id;

  try {
    const task = await taskData.findById(id);
    if (!task || !canAccess(task, req.user)) {
      return res.status(404).json({ error: "No Such Task" });
    }
    await taskData.deleteOne({ _id: task._id });
    res.send("Record Deleted Successfully!");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admins can edit every field; regular users can only mark their own tasks complete / not complete
export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await taskData.findById(id);
    if (!task || !canAccess(task, req.user)) {
      return res.status(404).json({ error: "No Such Task" });
    }

    const { taskName, user_id, due_date, priority, isComplete, notes } = req.body;

    if (isComplete !== undefined && isComplete !== "YES" && isComplete !== "NO") {
      return res.status(400).json({ error: "isComplete must be YES or NO" });
    }

    if (req.user.isAdmin) {
      if (user_id !== undefined && user_id !== task.user_id && !(await assigneeInOrg(user_id, req.user.organization))) {
        return res.status(400).json({ error: "Assigned user not found in your organization" });
      }
      const changes = { taskName, user_id, due_date, priority, isComplete, notes };
      Object.keys(changes).forEach((key) => changes[key] !== undefined && task.set(key, changes[key]));
    } else if (isComplete !== undefined) {
      task.isComplete = isComplete;
    }

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Regular users can only ask for their own tasks
export const findTasksByUser = async (req, res) => {
  if (!req.user.isAdmin && req.params.user !== String(req.user._id)) {
    return res.status(403).json({ error: "Not allowed to view these tasks" });
  }

  try {
    const tasks = await taskData.find({ user_id: req.params.user, organization_id: req.user.organization });
    res.send(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin only, own organization
export const findTasksByOrg = async (req, res) => {
  if (req.params.organization !== req.user.organization) {
    return res.status(403).json({ error: "Not allowed to view this organization" });
  }

  try {
    const tasks = await taskData.find({ organization_id: req.user.organization });
    res.send(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
