import Organization from "../models/orgModel.js";
import User from "../models/userModel.js";

// Public: creates a new organization together with its first admin
export const orgSignup = async (req, res) => {
    const { organization, email, password, first_name, last_name } = req.body;

    try {
        const org = new Organization({name: organization});
        const user = await User.signup(email, password, org._id, first_name, last_name, true);
        await org.save();
        res.send(user);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
};

// Users can only look up their own organization
export const findOrgName = async (req, res) => {
    if (req.params.organization !== req.user.organization) {
        return res.status(403).json({ error: "Not allowed to view this organization" });
    }

    try {
        const org = await Organization.findById(req.params.organization)
        res.send(org)
    } catch(error) {
        res.status(400).json({ error: error.message })
    }
}
