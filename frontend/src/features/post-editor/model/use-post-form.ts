import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PostStatus, UpsertPostRequest } from "../../../generated-openapi/models";
import { EMPTY_EDITOR_STATE_JSON } from "./editor-state";

type PostStatusLabel = "Draft" | "Published" | "Archived";

const STATUS_TO_NUMBER: Record<PostStatusLabel, PostStatus> = { Draft: 0, Published: 1, Archived: 2 };
const NUMBER_TO_STATUS: Record<number, PostStatusLabel> = { 0: "Draft", 1: "Published", 2: "Archived" };

export function toPostFormStatus(status: PostStatus | undefined): PostStatusLabel {
  return NUMBER_TO_STATUS[status ?? 0] ?? "Draft";
}

const postStatusSchema = z.enum(["Draft", "Published", "Archived"]);

const postFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  contentJson: z.string().trim().min(1, "Content is required."),
  coverImageMediaAssetId: z.string().uuid("Invalid cover image selection.").or(z.literal("")).nullable(),
  status: postStatusSchema,
  seoTitle: z.string().trim().max(180, "SEO title must be 180 characters or fewer.").or(z.literal("")).nullable(),
  seoDescription: z.string().trim().max(320, "SEO description must be 320 characters or fewer.").or(z.literal("")).nullable()
});

type PostFormValues = z.input<typeof postFormSchema>;

const defaultValues: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  contentJson: EMPTY_EDITOR_STATE_JSON,
  coverImageMediaAssetId: "",
  status: "Draft",
  seoTitle: "",
  seoDescription: ""
};

export function usePostForm(initialValues?: Partial<UpsertPostRequest>) {
  return useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      status: toPostFormStatus(initialValues?.status),
      coverImageMediaAssetId: initialValues?.coverImageMediaAssetId ?? "",
      seoTitle: initialValues?.seoTitle ?? "",
      seoDescription: initialValues?.seoDescription ?? ""
    }
  });
}

export function toUpsertPostRequest(values: PostFormValues): UpsertPostRequest {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim(),
    contentJson: values.contentJson.trim(),
    coverImageMediaAssetId: values.coverImageMediaAssetId?.trim() ? values.coverImageMediaAssetId.trim() : null,
    status: STATUS_TO_NUMBER[values.status],
    seoTitle: values.seoTitle?.trim() ? values.seoTitle.trim() : null,
    seoDescription: values.seoDescription?.trim() ? values.seoDescription.trim() : null
  };
}
