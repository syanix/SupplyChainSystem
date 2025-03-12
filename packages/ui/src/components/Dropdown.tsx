import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export interface DropdownItem {
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  width?: number;
  className?: string;
}

export const Dropdown = ({
  trigger,
  items,
  align = "left",
  width = 180,
  className,
}: DropdownProps) => {
  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${className || ""}`}
    >
      <Menu.Button as={React.Fragment}>{trigger}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } z-10 mt-2 origin-top-${align} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          style={{ width: `${width}px` }}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 h-px bg-gray-200" />;
              }

              const content = (
                <div className="flex items-center">
                  {item.icon && <div className="mr-2">{item.icon}</div>}
                  {item.label}
                </div>
              );

              return (
                <Menu.Item key={index} disabled={item.disabled}>
                  {({ active }) => {
                    if (item.href) {
                      return (
                        <a
                          href={item.href}
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } ${
                            item.disabled ? "cursor-not-allowed opacity-50" : ""
                          } block px-4 py-2 text-sm`}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <button
                        type="button"
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } ${
                          item.disabled ? "cursor-not-allowed opacity-50" : ""
                        } block w-full text-left px-4 py-2 text-sm`}
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        {content}
                      </button>
                    );
                  }}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
