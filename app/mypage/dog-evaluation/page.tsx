import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DogEvaluationPage = () => {
  return (
    <div>
      <Tabs defaultValue="handling" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="handling">ハンドリング</TabsTrigger>
          <TabsTrigger value="characteristics">基本特性</TabsTrigger>
          <TabsTrigger value="excitement">興奮時対応</TabsTrigger>
          <TabsTrigger value="socialization">犬社会性</TabsTrigger>
          {/* usageタブの名前を変更、trainingタブを削除してタブ数を5に変更 */}
          <TabsTrigger value="usage">利用・参加実績</TabsTrigger>
        </TabsList>
        {/* Content for each tab goes here */}
      </Tabs>
    </div>
  )
}

export default DogEvaluationPage
