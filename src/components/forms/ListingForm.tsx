import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListingValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreateListing, useUpdateListing } from "@/lib/react-query/queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type ListingFormProps = {
  listing?: Models.Document;
  action: "Create" | "Update";
};

const ListingForm = ({ listing, action }: ListingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof ListingValidation>>({
    resolver: zodResolver(ListingValidation),
    defaultValues: {
      title: listing ? listing?.title : "",
      description: listing ? listing?.description : "",
      price: listing ? listing?.price : 0,
      address: listing ? listing?.address : "",
      Bedroom: listing ? listing?.Bedroom : 1,
      bathrooms: listing ? listing?.bathrooms : 1,
      Sqft: listing ? listing?.Sqft : 0,
      file: [],
      tags: listing ? listing?.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createListing, isPending: isLoadingCreate } =
    useCreateListing();
  const { mutateAsync: updateListing, isPending: isLoadingUpdate } =
    useUpdateListing();

  // Handler
  const handleSubmit = async (value: z.infer<typeof ListingValidation>) => {
    const numericValues = {
      price: Number(value.price),
      Bedroom: String(value.Bedroom),
      bathrooms: Number(value.bathrooms),
      Sqft: String(value.Sqft),
    };
  
    const payload = {
      ...value,
      ...numericValues,
    };
  
    // ACTION = UPDATE
    if (listing && action === "Update") {
      const updatedListing = await updateListing({
        ...payload,
        listingId: listing.$id,
        imageId: listing.imageId,
        imageUrl: listing.imageUrl,
      });
  
      if (!updatedListing) {
        toast({
          title: `${action} listing failed. Please try again.`,
        });
      }
      return navigate(`/listings/${listing.$id}`);
    }
  
    // ACTION = CREATE
    const newListing = await createListing({
      ...payload,
      userId: user.id,
    });
  
    if (!newListing) {
      toast({
        title: `${action} listing failed. Please try again.`,
      });
    }
    navigate("/");
  };
    
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Title</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Description</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Price</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="number" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Address</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Bedroom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bedroom</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="number" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bathrooms</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="number" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Sqft"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Square Feet</FormLabel>
              <FormControl className=" bg-dark-4 ">
                <Input type="number" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={listing?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="House, Apartment, Sale"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Listing
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ListingForm;