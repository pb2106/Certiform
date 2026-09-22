"use client";

import { useState } from "react";
import { QuestionConfig, QuestionType, FormTheme } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Settings,
  Eye,
  Edit3,
  Sliders,
  Type,
  AlignLeft,
  CheckSquare,
  List,
  Star,
  Hash,
  Mail,
  Phone,
  Link2,
  Calendar,
  Clock,
  Sparkles,
  Save,
  PenTool,
  Upload,
  Grid,
  Video,
} from "lucide-react";
import { FormRenderer } from "./FormRenderer";

interface FormBuilderCanvasProps {
  formId: string;
  initialTitle: string;
  initialDescription?: string | null;
  initialQuestions: QuestionConfig[];
  initialTheme: FormTheme;
  onSave: (data: { title: string; description: string; questions: QuestionConfig[]; theme: FormTheme }) => void;
}

const QUESTION_TYPES: Array<{ type: QuestionType; label: string; icon: any }> = [
  { type: "text", label: "Short Text", icon: Type },
  { type: "paragraph", label: "Long Paragraph", icon: AlignLeft },
  { type: "single_choice", label: "Multiple Choice", icon: CheckSquare },
  { type: "multiple_choice", label: "Checkboxes", icon: List },
  { type: "dropdown", label: "Dropdown", icon: List },
  { type: "rating", label: "Star Rating", icon: Star },
  { type: "number", label: "Number", icon: Hash },
  { type: "email", label: "Email Address", icon: Mail },
  { type: "phone", label: "Phone Number", icon: Phone },
  { type: "url", label: "Website URL", icon: Link2 },
  { type: "date", label: "Date Picker", icon: Calendar },
  { type: "signature", label: "Signature Pad", icon: PenTool },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "matrix", label: "Matrix Grid", icon: Grid },
  { type: "media_embed", label: "Video Embed", icon: Video },
  { type: "section", label: "Section Break", icon: Sparkles },
];

function SortableQuestionItem({
  question,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  question: QuestionConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative rounded-2xl border p-5 bg-white dark:bg-slate-900 transition-all cursor-pointer ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {question.type.replace("_", " ")}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800"
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/50"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white text-base">
            {question.label} {question.required && <span className="text-rose-500">*</span>}
          </h3>
          {question.description && <p className="text-xs text-slate-500">{question.description}</p>}
        </div>
      </div>
    </div>
  );
}

export function FormBuilderCanvas({
  formId,
  initialTitle,
  initialDescription,
  initialQuestions,
  initialTheme,
  onSave,
}: FormBuilderCanvasProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");
  const [questions, setQuestions] = useState<QuestionConfig[]>(initialQuestions);
  const [theme, setTheme] = useState<FormTheme>(initialTheme);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(initialQuestions[0]?.id || null);
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((q, idx) => ({ ...q, order: idx + 1 }));
      });
    }
  };

  const addQuestion = (type: QuestionType) => {
    const newId = `q_${Date.now()}`;
    const newQ: QuestionConfig = {
      id: newId,
      type,
      label: `New ${type.replace("_", " ")} Block`,
      required: false,
      options: type === "single_choice" || type === "multiple_choice" || type === "dropdown" ? ["Option 1", "Option 2", "Option 3"] : undefined,
      matrixRows: type === "matrix" ? ["Statement 1", "Statement 2"] : undefined,
      matrixCols: type === "matrix" ? ["Strongly Disagree", "Neutral", "Strongly Agree"] : undefined,
      mediaUrl: type === "media_embed" ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : undefined,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, newQ]);
    setSelectedQuestionId(newId);
  };

  const updateQuestion = (id: string, updates: Partial<QuestionConfig>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (selectedQuestionId === id) {
      setSelectedQuestionId(questions.find((q) => q.id !== id)?.id || null);
    }
  };

  const duplicateQuestion = (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;
    const cloneId = `q_${Date.now()}`;
    const clone: QuestionConfig = {
      ...target,
      id: cloneId,
      label: `${target.label} (Copy)`,
      order: questions.length + 1,
    };
    setQuestions((prev) => [...prev, clone]);
    setSelectedQuestionId(cloneId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Header Bar */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-bold text-lg text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab("build")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "build" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Canvas Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "preview" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview Form
            </button>
          </div>

          <button
            onClick={() => onSave({ title, description, questions, theme })}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
          >
            <Save className="h-3.5 w-3.5" /> Save Workspace
          </button>
        </div>
      </div>

      {activeTab === "preview" ? (
        <div className="p-6">
          <FormRenderer formId={formId} title={title} description={description} questions={questions} theme={theme} isPreview={true} />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-12 gap-8">
          {/* Left Sidebar: Add Question Palette */}
          <div className="col-span-3 space-y-4 sticky top-36 h-fit max-h-[80vh] overflow-y-auto pr-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Form Element Palette</h3>
              <div className="grid grid-cols-1 gap-2">
                {QUESTION_TYPES.map((qt) => {
                  const Icon = qt.icon;
                  return (
                    <button
                      key={qt.type}
                      onClick={() => addQuestion(qt.type)}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 text-left text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 transition-all"
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      {qt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Column: Drag-and-Drop Canvas */}
          <div className="col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Form Title"
                className="w-full text-2xl font-bold text-slate-900 bg-transparent focus:outline-none dark:text-white mb-2"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description or instructions..."
                rows={2}
                className="w-full text-sm text-slate-600 bg-transparent focus:outline-none dark:text-slate-400 resize-none"
              />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {questions.map((q) => (
                    <SortableQuestionItem
                      key={q.id}
                      question={q}
                      isSelected={selectedQuestionId === q.id}
                      onSelect={() => setSelectedQuestionId(q.id)}
                      onDelete={() => deleteQuestion(q.id)}
                      onDuplicate={() => duplicateQuestion(q.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Right Sidebar: Question Inspector */}
          <div className="col-span-3 sticky top-36 h-fit">
            {selectedQuestion ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-600" /> Inspector & Settings
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Block Label / Question</label>
                  <input
                    type="text"
                    value={selectedQuestion.label}
                    onChange={(e) => updateQuestion(selectedQuestion.id, { label: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subtext / Instructions</label>
                  <input
                    type="text"
                    value={selectedQuestion.description || ""}
                    onChange={(e) => updateQuestion(selectedQuestion.id, { description: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {selectedQuestion.type === "media_embed" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Video / Media Embed URL</label>
                    <input
                      type="text"
                      value={selectedQuestion.mediaUrl || ""}
                      onChange={(e) => updateQuestion(selectedQuestion.id, { mediaUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Required Field</span>
                  <input
                    type="checkbox"
                    checked={selectedQuestion.required || false}
                    onChange={(e) => updateQuestion(selectedQuestion.id, { required: e.target.checked })}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                Select an element on the canvas to inspect properties.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
