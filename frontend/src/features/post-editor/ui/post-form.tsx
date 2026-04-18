import { useEffect } from "react";
import type { UpsertPostRequest } from "../../../shared/api/generated/blog/models";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Textarea } from "../../../shared/ui/textarea";
import { toUpsertPostRequest, usePostForm } from "../model/use-post-form";

type PostFormProps = {
  initialValues?: Partial<UpsertPostRequest>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: UpsertPostRequest) => Promise<void>;
};

export function PostForm({ initialValues, isSubmitting, submitLabel, onSubmit }: PostFormProps) {
  const form = usePostForm(initialValues);

  useEffect(() => {
    form.reset({
      title: initialValues?.title ?? "",
      excerpt: initialValues?.excerpt ?? "",
      contentMarkdown: initialValues?.contentMarkdown ?? "",
      coverImageUrl: initialValues?.coverImageUrl ?? "",
      isPublished: initialValues?.isPublished ?? true
    });
  }, [form, initialValues]);

  const {
    formState: { errors },
    register
  } = form;

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(toUpsertPostRequest(values));
      })}
    >
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="title">
          Title
        </label>
        <Input id="title" {...register("title")} />
        {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="excerpt">
          Excerpt
        </label>
        <Textarea id="excerpt" rows={4} {...register("excerpt")} />
        {errors.excerpt ? <p className="text-sm text-red-600">{errors.excerpt.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="contentMarkdown">
          Content
        </label>
        <Textarea id="contentMarkdown" rows={12} {...register("contentMarkdown")} />
        {errors.contentMarkdown ? <p className="text-sm text-red-600">{errors.contentMarkdown.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="coverImageUrl">
          Cover image URL
        </label>
        <Input id="coverImageUrl" {...register("coverImageUrl")} />
        {errors.coverImageUrl ? <p className="text-sm text-red-600">{String(errors.coverImageUrl.message)}</p> : null}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input type="checkbox" {...register("isPublished")} />
        Publish immediately
      </label>

      <div className="flex justify-end">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
