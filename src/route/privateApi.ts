import express from "express";
import userController from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import contactController from "../controller/contact.controller";

const privateRouter = express.Router();

privateRouter.use(authMiddleware);
privateRouter.get("/api/users/current", userController.getUser);
privateRouter.patch("/api/users/current", userController.updateUser);
privateRouter.delete("/api/users/logout", userController.logout);

privateRouter.post("/api/contacts", contactController.createContact);
privateRouter.get("/api/contacts/:contactId", contactController.getContact);
privateRouter.put("/api/contacts/:contactId", contactController.updateContact);
privateRouter.delete(
  "/api/contacts/:contactId",
  contactController.removeContact
);
privateRouter.get("/api/contacts", contactController.searchContact);

export default privateRouter;
