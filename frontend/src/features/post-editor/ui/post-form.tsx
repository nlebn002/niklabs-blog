import { useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import type { UpsertPostRequest } from "../../../generated-openapi/models";
import { createSlug, EMPTY_EDITOR_STATE_JSON } from "../model/editor-state";
import { toUpsertPostRequest, usePostForm } from "../model/use-post-form";
import { CoverImageInput } from "./cover-image-input";
import { LexicalEditorField } from "./lexical-editor-field";

type PostFormProps = {
  initialValues?: Partial<UpsertPostRequest> & { coverImageUrl?: string | null };
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: UpsertPostRequest) => Promise<void>;
};

export function PostForm({ initialValues, isSubmitting, submitLabel, onSubmit }: PostFormProps) {
  const form = usePostForm(initialValues);

  useEffect(() => {
    form.reset({
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      excerpt: initialValues?.excerpt ?? "",
      contentJson: initialValues?.contentJson ?? EMPTY_EDITOR_STATE_JSON,
      coverImageMediaAssetId: initialValues?.coverImageMediaAssetId ?? "",
      status: initialValues?.status ?? "Draft",
      seoTitle: initialValues?.seoTitle ?? "",
      seoDescription: initialValues?.seoDescription ?? ""
    });
  }, [form, initialValues]);

  const {
    formState: { errors },
    register,
    setValue,
    watch
  } = form;
  const title = watch("title");
  const slug = watch("slug");

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(toUpsertPostRequest(values));
      })}
    >
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="title">
          Title
        </label>
        <Input id="title" {...register("title")} />
        {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setValue("slug", createSlug(title), { shouldDirty: true, shouldValidate: true })}
          >
            Generate slug from title
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="excerpt">
          Excerpt
        </label>
        <Textarea id="excerpt" rows={4} {...register("excerpt")} />
        {errors.excerpt ? <p className="text-sm text-destructive">{errors.excerpt.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="slug">
          Slug
        </label>
        <Input id="slug" {...register("slug")} />
        {errors.slug ? <p className="text-sm text-destructive">{errors.slug.message}</p> : null}
        {slug ? <p className="text-xs text-muted-foreground">URL slug: /posts/{slug}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground">
          Content
        </label>
        <LexicalEditorField
          value={watch("contentJson")}
          onChange={(value) => setValue("contentJson", value, { shouldDirty: true, shouldValidate: true })}
        />
        {errors.contentJson ? <p className="text-sm text-destructive">{errors.contentJson.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground">
          Cover Image
        </label>
        <CoverImageInput
          initialImageUrl={initialValues?.coverImageUrl ?? null}
          onChange={({ mediaAssetId }) =>
            setValue("coverImageMediaAssetId", mediaAssetId ?? "", { shouldDirty: true, shouldValidate: true })
          }
        />
        <input type="hidden" {...register("coverImageMediaAssetId")} />
        {errors.coverImageMediaAssetId ? <p className="text-sm text-destructive">{String(errors.coverImageMediaAssetId.message)}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className="h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:border-[var(--accent-border)] focus:ring-[3px] focus:ring-primary/10"
          {...register("status")}
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
        {errors.status ? <p className="text-sm text-destructive">{errors.status.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="seoTitle">
          SEO Title
        </label>
        <Input id="seoTitle" {...register("seoTitle")} />
        {errors.seoTitle ? <p className="text-sm text-destructive">{String(errors.seoTitle.message)}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor="seoDescription">
          SEO Description
        </label>
        <Textarea id="seoDescription" rows={4} {...register("seoDescription")} />
        {errors.seoDescription ? <p className="text-sm text-destructive">{String(errors.seoDescription.message)}</p> : null}
      </div>

      <div className="flex justify-end">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
