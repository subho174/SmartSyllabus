"use client";

import React, { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, courseSchemaType } from "../schemas/courseSchema";

export interface initialStateType {
  message: string;
  status: number;
  // data?: ITask[];
}

interface PropsType {
  children?: React.ReactNode;
  // className?: string
  submitFunction: (
    prevState: initialStateType,
    formData: FormData
  ) => Promise<initialStateType>;
  modalHeaderText: string;
  btnText: string;
  loadingBtnText: string;
  onSuccess?: (data: string) => void;
  // initialState: initialStateType;
}

export default function HandleServerAction({
  children,
  submitFunction,
  modalHeaderText,
  btnText,
  loadingBtnText,
}: PropsType) {
  const initialState: initialStateType = {
    message: "",
    status: 0,
    // data: [{ title: "" }],
  };

  const [state, formAction, isPending] = useActionState(
    submitFunction,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      switch (Math.floor(state.status / 100)) {
        case 2:
          toast.success(state.message);
          router.refresh();
          break;
        case 4:
          toast.error(state.message);
          break;
        case 5:
          toast.info(state.message);
      }
    }
  }, [state]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const form = useForm<courseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
    },
  });

  const submitForm = async (data: courseSchemaType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    startTransition(() => formAction(formData));
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {btnText}
      </Button>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={form.handleSubmit(submitForm)}>
              <ModalHeader className="flex flex-col gap-1">
                {modalHeaderText}
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  isDisabled={isPending}
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? `${loadingBtnText}...` : btnText}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
