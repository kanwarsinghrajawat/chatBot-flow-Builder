import { Description, Dialog, DialogPanel } from "@headlessui/react";

const Modal = ({ isOpen, setIsOpen }: any) => {
  return (
    <>
      {isOpen && (
        <section
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"
          aria-hidden="true"
        >
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className=" z-50 fixed inset-0 bg-black bg-opacity-50 backdrop-blur rounded-lg"
          >
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 rounded-lg">
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                <Description>Cannot save Flow</Description>
                <Description>All nodes must be connected! </Description>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => setIsOpen(false)}>OK</button>
                  <button onClick={() => setIsOpen(false)}>CLOSE</button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </section>
      )}
    </>
  );
};

export default Modal;
