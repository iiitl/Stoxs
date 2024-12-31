import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"

function CardDetails() {
    const [ totalValue, setTotalValue ] = useState<number | null>(null)
    const [ topPerforming, setTopPerforming ] = useState<{ name: string, ticker: string } | null>(null)
    const [ marketStatus, setMarketStatus ] = useState<boolean>(false)

    const handleGetTotalValue = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/portfolio/total-value`)
            const data = await res.json()
            setTotalValue(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetTopPerforming = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/portfolio/top-performing`)
            const data = await res.json()
            setTopPerforming(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetMarketStatus = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/stocks/US/market-status`)
            const data = await res.json()
            setMarketStatus(data?.isOpen)
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        handleGetTotalValue()
        handleGetTopPerforming()
        handleGetMarketStatus()
    }, [])


    return (
    <>
        <div className="flex justify-around space-x-4 p-6">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Market Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {marketStatus ? <p className="font-bold text-blue-500">Market is Open</p> : <p className="font-bold text-red-600">Market is Closed</p>}
                </CardContent>
            </Card>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{totalValue?.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>TopPerforming</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{topPerforming?.name}</p>
                    <p className="text-sm">{topPerforming?.ticker}</p>
                </CardContent>
            </Card>
        </div>
    </>
    )
}

export default CardDetails