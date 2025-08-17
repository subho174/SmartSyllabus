import { IFlashcard } from "@/src/types/flashcard";
import { ISummary } from "@/src/types/summary";
import { Button } from "@heroui/button";
import { Save, SparklesIcon, Trash } from "lucide-react";
import React from "react";

const SharedCTA = React.memo(
  ({
    isPendingGeneration,
    generateHandler,
    isPendingSave,
    saveHandler,
    isPendingDelete,
    deleteHandler,
    disableButtons,
    items,
    index,
  }: {
    isPendingGeneration: boolean;
    generateHandler: () => void;
    isPendingSave: boolean;
    saveHandler: () => void;
    isPendingDelete: boolean;
    deleteHandler: () => void;
    disableButtons: () => boolean;
    items: ISummary[] | IFlashcard[];
    index: number;
  }) => {
    return (
      <div className="flex mx-3 justify-end my-6 gap-6">
        <Button
          onClick={generateHandler}
          isDisabled={disableButtons()}
          isLoading={isPendingGeneration}
          variant="flat"
          startContent={
            !isPendingGeneration && (
              <SparklesIcon className="h-5 w-5 transition-transform group-hover:rotate-90" />
            )
          }
          className="self-center"
        >
          {isPendingGeneration ? "Regenerating.." : "Regenerate"}
        </Button>

        <Button
          onClick={saveHandler}
          isDisabled={disableButtons()}
          isLoading={isPendingSave}
          variant="flat"
          hidden={!!items[index]._id}
          startContent={!isPendingSave && <Save className="h-5 w-5" />}
          className="self-center"
        >
          {isPendingSave ? "Saving.." : "Save"}
        </Button>

        <Button
          onClick={deleteHandler}
          isDisabled={disableButtons()}
          isLoading={isPendingDelete}
          color="danger"
          variant="bordered"
          hidden={!items[index]._id}
          startContent={!isPendingDelete && <Trash className="h-5 w-5" />}
          className="self-center"
        >
          {isPendingDelete ? "Deleting.." : "Delete"}
        </Button>
      </div>
    );
  }
);

export default SharedCTA;
