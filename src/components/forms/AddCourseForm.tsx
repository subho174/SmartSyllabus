"use client";

import HandleServerAction from "@/src/components/forms/HandleServerAction";
import { courseSchema, CourseSchemaType } from "@/src/schemas/courseSchema";
import { addCourse } from "@/src/server-action/server";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const AddCourseForm = () => {
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
    },
  });

  return (
    <HandleServerAction<CourseSchemaType>
      submitFunction={addCourse}
      form={form}
      modalHeaderText="Add New Course"
      btnText="Add course"
      loadingBtnText="Adding"
    >
      <Controller
        control={form.control}
        name="title"
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <Input
            ref={ref}
            isRequired
            errorMessage={error?.message}
            validationBehavior="aria"
            isInvalid={invalid}
            label="Title"
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
        rules={{ required: "Course title is required." }}
      />
    </HandleServerAction>
  );
};

export default AddCourseForm;
