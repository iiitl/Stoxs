import { Chart } from "@/components/Chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Home() {

  const [ sampleData, setSampleData ] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8080/api/portfolio/distribution`)
      const data = await res.json()
      setSampleData(data)
    }
    fetchData()
  }, [])

  return (
    <div className="flex items-center justify-around py-12">
      <div className="w-[48%] flex justify-center items-center flex-col">
        <div>
          <h1 className="text-4xl font-bold text-center py-4">Why you need stoxs ? </h1>
          <p className="text-center text-lg text-muted-foreground">
            Stoxs is a platform that helps you to manage your stock portfolio. It provides you with the
            tools to track your portfolio performance, get insights on your stock distribution and
            compare your portfolio with the market.
          </p>
        </div>
        <Card className="mt-12 w-[70%]">
          <CardHeader>
            <CardTitle>Want to know status of your Portfolio?</CardTitle>
            <CardDescription>Check Now</CardDescription>
          </CardHeader>
          <CardContent>
              Visit the dashboard to get the status of your portfolio
              <Button className="my-4">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-[48%]">
        <h1 className="text-4xl font-bold text-center py-4">Portfolio Distribution</h1>
        <Chart data={sampleData} />
      </div>
    </div>
  )
}

export default Home
