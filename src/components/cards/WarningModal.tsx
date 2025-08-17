import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

const WarningModal = ({
  isOpen,
  onClose,
  itemType,
}: {
  isOpen: boolean;
  onClose: () => void;
  itemType: "Summary" | "Flashcard";
}) => {
  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size="md"
      backdrop="blur"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-yellow-400">
              Warning
            </ModalHeader>
            <ModalBody>
              {itemType === "Summary" ? (
                <p>
                  You can save at most 3 summaries for each topic. Please delete
                  saved summary to save new one.
                </p>
              ) : (
                <p>
                  You can save at most 10 flashacards for each topic. Please
                  delete saved flashcard to save new one.
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default WarningModal;
