import React from "react";
import { Tab } from "@headlessui/react";

export interface TabItem {
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  variant?: "underline" | "pills" | "enclosed";
  className?: string;
}

export const Tabs = ({
  items,
  defaultIndex = 0,
  onChange,
  variant = "underline",
  className,
}: TabsProps) => {
  const variantStyles = {
    underline: {
      list: "flex space-x-8 border-b border-gray-200",
      tab: {
        active: "border-indigo-500 text-indigo-600",
        inactive:
          "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
        base: "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
    pills: {
      list: "flex space-x-2",
      tab: {
        active: "bg-indigo-100 text-indigo-700",
        inactive: "text-gray-500 hover:text-gray-700",
        base: "px-3 py-2 font-medium text-sm rounded-md",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
    enclosed: {
      list: "flex space-x-1 rounded-xl bg-gray-100 p-1",
      tab: {
        active: "bg-white shadow",
        inactive: "text-gray-500 hover:text-gray-700",
        base: "w-full py-2.5 text-sm font-medium leading-5 text-gray-700 rounded-lg",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
        <Tab.List className={styles.list}>
          {items.map((item, index) => (
            <Tab
              key={index}
              disabled={item.disabled}
              className={({ selected }) =>
                `${styles.tab.base} ${
                  selected ? styles.tab.active : styles.tab.inactive
                } ${item.disabled ? styles.tab.disabled : ""}`
              }
            >
              {item.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {items.map((item, index) => (
            <Tab.Panel key={index}>{item.content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
