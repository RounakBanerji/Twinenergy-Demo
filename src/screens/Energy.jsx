import EnergyList from "../components/EnergyList"

export default function Energy() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Energy Data</h2>
      </div>
      <EnergyList />
    </div>
  )
}
