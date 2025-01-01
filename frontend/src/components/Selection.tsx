
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Suggestions {
    description: string
    displaySymbol: string
    symbol: string  
    type: string
}

interface Stock {
    name: string
    ticker: string
    quantity: number
    buyPrice: number
}

function Selection() {

    const navigate = useNavigate();

    const [ isStock, setIsStock ] = useState<boolean>(true)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ page, setPage ] = useState<number>(1)
    const [ stock, setStock ] = useState<string>('')
    const [ suggestions, setSuggestions ] = useState<Suggestions[]>([])
    const [ selectedValue, setSelectedValue ] = useState<Suggestions | null>(null)
    const [ formData, setFormData ] = useState(
        {
            quantity: 0,
            buyPrice: 0,
        }
    )

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/stocks/suggestions/${stock}`)
            const data = await res.json()
            const value = data.result;
            // filter out the suggestion that does not contain . or - in symbol
            const newSuggestion = value.filter((suggestion: Suggestions) => !suggestion.displaySymbol.includes('.') && !suggestion.displaySymbol.includes('-'))
            console.log(newSuggestion)
            console.log(value)
            setSuggestions(newSuggestion) 
        } catch (error) {
            console.log(error)
        }finally{  
            setIsLoading(false)
        }
    }

    const handleSelect = (value : Suggestions) => {
        value.description = value.description.split('-')[0];
        setSelectedValue(value)
        setIsStock(false)
    }

    const displaySuggestions = () : ReactNode => {
        const start = (page-1)*9;
        const end = page*9;
        return (
            <>
            <p className="text-center font-bold text-4xl pt-10 -pb-6">
                Suggested Stocks
            </p>
            <div className="grid grid-cols-3 justify-center items-center gap-4 p-10">
                {
                    suggestions.slice(start, end).map((suggestion, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-md">
                            <div>
                                <p>{suggestion.description.split('-')[0]}</p>
                                <p className="font-semibold text-lg">{suggestion.displaySymbol}</p>
                            </div>
                            <Button onClick={() => handleSelect(suggestion)}>select</Button>
                        </div>
                    ))
                }
                
            </div>
            <div className="flex justify-between items-center px-10">
                <Button onClick={() => setPage(page-1)} disabled={page === 1}>Previous</Button>
                <Button onClick={() => setPage(page+1)} disabled={page === Math.ceil(suggestions.length/10)}>Next</Button>
            </div>
            </>
        )
    }

    const handleFormSubmit = async () => {
        setIsLoading(true)

        const sendingData: Stock = {
            name: selectedValue?.description || '',
            ticker: selectedValue?.displaySymbol || '',
            quantity: formData.quantity,
            buyPrice: formData.buyPrice
        }

        const res = await fetch(`http://localhost:8080/api/stocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendingData)
        })

        const data = await res.json()
        console.log(data)
        setIsLoading(false)
        navigate('/dashboard')
    }

    return (
    <>  
        {isStock ?
        <div>
            <div  className="flex flex-col justify-center items-center">
                <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Stock</CardTitle>
                    <CardDescription>Search for the stock</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                            id="name" 
                            placeholder="Name"
                            onChange={(e) => setStock(e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Button onClick={() => handleSearch()}>
                                {isLoading ? 'Loading...' : 'Search'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
                {suggestions.length && displaySuggestions()}
        </div>
        :
        selectedValue && <div className="flex justify-center items-center">
            <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Stock Value</CardTitle>
                <CardDescription>Enter detail for your stock</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                        id="name" 
                        placeholder="Name"
                        value={selectedValue?.description}
                        disabled
                    />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Ticker</Label>
                    <Input 
                        id="name" 
                        placeholder="Ticker" 
                        value={selectedValue?.displaySymbol}
                        disabled
                    />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Quantity</Label>
                    <Input 
                        id="name" 
                        placeholder="Quantity" 
                        type="number"
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Buy Price</Label>
                    <Input 
                        id="name" 
                        placeholder="Buy Price" 
                        type="number"
                        onChange={(e) => setFormData({...formData, buyPrice: parseInt(e.target.value)})}
                    />
                    </div>
                </div>
                <div className="flex flex-col space-y-1.5 my-4">
                    <Button onClick={() => handleFormSubmit()}>
                        {isLoading ? 'Loading...' : 'Submit'}
                    </Button>
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Button variant="destructive">Warning : Do not refresh</Button>
                </div>
            </CardContent>
            </Card>
        </div>
        }
    </>
    )
}

export default Selection