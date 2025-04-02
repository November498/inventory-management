import React from "react";

const ModalForm = ({
  isOpen,
  onClose,
  title,
  formFields,
  validationErrors,
  onSubmit,
  children,
}) => {
  if (!isOpen) return null; // Only show the modal if it's open

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="z-50 flex h-fit w-[35%] flex-col gap-12 rounded-md bg-white p-4 py-6">
        <h3 className="text-lg">{title}</h3>
        <form className="flex flex-col" onSubmit={onSubmit}>
          {formFields.map((field, index) => (
            <div key={index} className="flex items-start gap-2">
              <label className="w-1/3 text-sm font-medium text-gray-600">
                {field.label}
              </label>
              <div className="flex w-2/3 flex-col">
                {field.type === "select" ? (
                  <select
                    className="rounded-md border p-2 text-sm text-gray-400"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="rounded-md border p-2 text-sm"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}

                <span className="ml-auto h-6 text-sm italic text-red-500">
                  {validationErrors[field.label] && field.errorMessage}
                </span>
              </div>
            </div>
          ))}

          {children}

          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-400"
              onClick={onClose}
            >
              Discard
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
