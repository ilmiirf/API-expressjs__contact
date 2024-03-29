import { Request } from "express";
import { validate } from "../validation/validation";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contact.validation";
import { prisma } from "../app/database";
import { ResponseError } from "../error/response.error";
import { UserType } from "../types/userTypes";

const createContact = async (user: any, request: Request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user.username;
  const result = await prisma.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
  return result;
};

const getContact = async (user: any, contactId: any) => {
  contactId = validate(getContactValidation, contactId);
  const contact = await prisma.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
  if (!contact) {
    throw new ResponseError(404, "contact not found");
  }
  return contact;
};

const updateContact = async (user: any, req: Request) => {
  const contact = validate(updateContactValidation, req);
  const totalContact = await prisma.contact.count({
    where: {
      username: user.username,
      id: contact.id,
    },
  });
  if (totalContact === 0) {
    throw new ResponseError(404, "contact not found");
  }

  const result = await prisma.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
  return result;
};

const removeContact = async (user: any, contactId: any) => {
  contactId = validate(getContactValidation, contactId);
  const totalContact = await prisma.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });
  if (totalContact === 0) {
    throw new ResponseError(404, "contact not found");
  }
  await prisma.contact.delete({
    where: {
      id: contactId,
    },
  });
};

const searchContact = async (user: any, req: any) => {
  const contactRequest = validate(searchContactValidation, req);
  const offset = (contactRequest.page - 1) * contactRequest.size;

  const filters = [];
  filters.push({
    username: user.username,
  });
  if (contactRequest.name) {
    filters.push({
      OR: [
        {
          first_name: {
            contains: contactRequest.name,
          },
        },
        {
          last_name: {
            contains: contactRequest.name,
          },
        },
      ],
    });
  }
  if (contactRequest.email) {
    filters.push({
      email: {
        contains: contactRequest.email,
      },
    });
  }
  if (contactRequest.phone) {
    filters.push({
      phone: {
        contains: contactRequest.phone,
      },
    });
  }

  const contacts = await prisma.contact.findMany({
    where: {
      AND: filters,
    },
    take: contactRequest.size,
    skip: offset,
  });
  const totalItems = await prisma.contact.count({
    where: {
      AND: filters,
    },
  });
  return {
    data: contacts,
    paging: {
      page: contactRequest.page,
      total_items: totalItems,
      total_pages: Math.ceil(totalItems / contactRequest.size),
    },
  };
};

export default {
  createContact,
  getContact,
  updateContact,
  removeContact,
  searchContact,
};
