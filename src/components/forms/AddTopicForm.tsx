"use client";

import HandleServerAction from "@/src/components/forms/HandleServerAction";
import { topicSchema, TopicSchemaType } from "@/src/schemas/topicSchema";
import { addTopic } from "@/src/server-action/server";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const AddTopicForm = ({courseId}: {courseId: string}) => {
    
  const form = useForm<TopicSchemaType>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: "",
      courseId: courseId!,
    },
  });

  return (
    <HandleServerAction<TopicSchemaType>
          submitFunction={addTopic}
          form={form}
          modalHeaderText="Add New Topic"
          btnText="Add Topic"
          loadingBtnText="Adding"
        >
          <Controller
            control={form.control}
            name="courseId"
            render={() => <input value={courseId!} readOnly hidden />}
            rules={{ required: "Course Id is required." }}
          />
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
            rules={{ required: "Topic title is required." }}
          />
        </HandleServerAction>
  )
}

export default AddTopicForm