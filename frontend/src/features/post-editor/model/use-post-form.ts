import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UpsertPostRequest } from "../../../generated-openapi/models";

const postFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  contentMarkdown: z.string().trim().min(1, "Content is required."),
  coverImageUrl: z.string().trim().url("Cover image URL must be valid.").or(z.literal("")).nullable(),
  isPublished: z.boolean()
});

type PostFormValues = z.input<typeof postFormSchema>;

const defaultValues: PostFormValues = {
  title: "",
  excerpt: "",
  contentMarkdown: "",
  coverImageUrl: "",
  isPublished: true
};

export function usePostForm(initialValues?: Partial<UpsertPostRequest>) {
  return useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      coverImageUrl: initialValues?.coverImageUrl ?? ""
    }
  });
}

export function toUpsertPostRequest(values: PostFormValues): UpsertPostRequest {
  return {
    title: values.title.trim(),
    excerpt: values.excerpt.trim(),
    contentMarkdown: values.contentMarkdown.trim(),
    coverImageUrl: values.coverImageUrl?.trim() ? values.coverImageUrl.trim() : null,
    isPublished: values.isPublished
  };
}
