import BuilderPageHeader from "~/components/builder/BuilderPageHeader";
import { ExecutionPanel } from "~/components/builder/ExecutionPanel";
import { OutputPanel } from "~/components/builder/OutputPanel";
import ToolkitPanel from "~/components/builder/ToolkitPanel";
import WorkflowCanvas from "~/components/builder/WorkflowCanvas";

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BuilderPageHeader />

      <div className="flex flex-1 overflow-hidden">
        <ToolkitPanel />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <WorkflowCanvas />
        </main>
        <ExecutionPanel />
      </div>

      <OutputPanel />
    </div>
  )
}