import { NextFunction, Request, Response } from "express";
import { RequestUser, UserType } from "../types/userTypes";
import contactService from "../service/contact.service";

const createContact = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await contactService.createContact(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const result = await contactService.getContact(user, contactId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const request = req.body;
    request.id = contactId;

    const result = await contactService.updateContact(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const result = await contactService.removeContact(user, contactId);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const searchContact = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const request: any = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      page: req.query.page,
      size: req.params.size,
    };
    const result = await contactService.searchContact(user, request);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createContact,
  getContact,
  updateContact,
  removeContact,
  searchContact,
};
