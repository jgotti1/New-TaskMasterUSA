import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: "1d" });
};

//login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create token
    const token = createToken(user._id);

    res.status(200).json({ email, token, userFirstName: user.first_name, userLastName: user.last_name, isAdmin: user.isAdmin, organization: user.organization, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin creates a user (or another admin) in their own organization
export const signupUser = async (req, res) => {
  const { email, password, first_name, last_name, isAdmin } = req.body;

  try {
    const user = await User.signup(email, password, req.user.organization, first_name, last_name, isAdmin === true);

    //create token
    const token = createToken(user._id);

    res.status(200).json({ email, token, userFirstName: user.first_name, userLastName: user.last_name, organization: user.organization });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admins get everyone in their organization; regular users only get themselves
export const findUsersByOrg = async (req, res) => {
  if (req.params.organization !== req.user.organization) {
    return res.status(403).json({ error: "Not allowed to view this organization" });
  }

  try {
    const filter = req.user.isAdmin ? { organization: req.user.organization } : { _id: req.user._id };
    const users = await User.find(filter);
    res.send(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  const id = req.params.id;

  if (id === String(req.user._id)) {
    return res.status(400).json({ error: "You can't delete your own account" });
  }

  try {
    const user = await User.findOneAndDelete({ _id: id, organization: req.user.organization });
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }
    res.send("User has been deleted");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Only these fields can be changed, and only for users in the admin's organization
export const updateUser = async (req, res) => {
  const { _id, first_name, last_name, email, isAdmin } = req.body;

  try {
    const update = {};
    if (typeof first_name === "string") update.first_name = first_name;
    if (typeof last_name === "string") update.last_name = last_name;
    if (typeof email === "string") {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Email not valid" });
      }
      update.email = email;
    }
    if (typeof isAdmin === "boolean") {
      if (!isAdmin && String(_id) === String(req.user._id)) {
        return res.status(400).json({ error: "You can't remove your own admin access" });
      }
      update.isAdmin = isAdmin;
    }

    const user = await User.findOneAndUpdate({ _id, organization: req.user.organization }, update, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: "No such user" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
