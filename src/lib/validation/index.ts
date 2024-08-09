import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

// ============================================================
// CREATE LISTING
// ============================================================
export const ListingValidation = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long." }).max(100, { message: "Title can be up to 100 characters long." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long." }).max(5000, { message: "Description can be up to 5000 characters long." }),
  price: z.number().min(0, { message: "Price must be a positive number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long." }).max(1000, { message: "Address can be up to 1000 characters long." }),
  bedrooms: z.number().min(1, { message: "There must be at least 1 bedroom." }),
  bathrooms: z.number().min(1, { message: "There must be at least 1 bathroom." }),
  squareFeet: z.number().min(1, { message: "Square feet must be a positive number." }),
  file: z.custom<File[]>(),
  tags: z.string().optional(),
});
