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
} from "@heroui/react";
import { FieldValues, type UseFormReturn } from "react-hook-form";
import { ISummary } from "@/src/types/summary";
export interface initialStateType {
  message: string;
  status: number;
  data?: ISummary;
}

interface PropsType<FormDataType extends FieldValues> {
  children?: React.ReactNode;
  // className?: string
  submitFunction: (
    prevState: initialStateType,
    formData: FormData
  ) => Promise<initialStateType>;
  form: UseFormReturn<FormDataType>,
  modalHeaderText: string;
  btnText: string;
  loadingBtnText: string;
  onSuccess?: (data: string) => void;
  // initialState: initialStateType;
}

export default function HandleServerAction<FormDataType extends FieldValues>({
  children,
  submitFunction,
  form,
  modalHeaderText,
  btnText,
  loadingBtnText,
}: PropsType<FormDataType>) {
  const initialState: initialStateType = {
    message: "",
    status: 0,
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

  const submitForm = async (data: FormDataType) => {
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
                {children}
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
