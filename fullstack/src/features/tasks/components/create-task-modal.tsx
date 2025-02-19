"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useCreateAITaskModal } from "../hooks/use-create-ai-task-modal";
import { CreateTaskFormAI } from "./create-task-form-ai";

export const CreateTaskModal = () => {
  const { isOpen, close } = useCreateTaskModal(); // ✅ Removed setIsOpen

  return (
    <ResponsiveModal open={isOpen} onOpenChange={close}> 
      <CreateTaskFormWrapper onCancel={close} /> 
    </ResponsiveModal>
  );
};


export const CreateTaskModalAI = () => {
  const { isOpen, close } = useCreateAITaskModal();

 

  return (
    <ResponsiveModal open={isOpen} onOpenChange={close}>
      <CreateTaskFormAI onCancel={close} /> 
    </ResponsiveModal>
  );
};

