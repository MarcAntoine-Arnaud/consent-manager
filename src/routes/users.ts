import { Router } from "express";
import {
  registerUserIdentifier,
  signup,
  login,
  getUserById,
  registerUserIdentifiers,
  me,
  updateUserById,
  deleteUserById,
} from "../controllers/usersController";
import { verifyParticipantJWT, verifyUserJWT } from "../middleware/auth";
const r: Router = Router();

r.post("/signup", signup);
r.post("/login", login);
r.delete("/logout", async (req, res, next) => {
  try {
    if (!req.session) {
      return res.status(200).send("OK");
    }

    req?.session?.destroy(() => {
      return res.status(200).json({
        data: {},
        message: "successful logout",
      });
    });
  } catch (err) {
    next(err);
  }
});
r.get("/me", verifyUserJWT, me);

// Used by Participants / Data Space Connectors to register a end user from their platform
// This might change when using more decentralized identifiers for end users
r.post("/register", verifyParticipantJWT, registerUserIdentifier);
r.post("/registers", verifyParticipantJWT, registerUserIdentifiers);
r.put("/:id", verifyParticipantJWT, updateUserById);
r.delete("/:id", verifyParticipantJWT, deleteUserById);
r.get("/:userId/", getUserById);
r.get("/:userId/:consentId");

export default r;
