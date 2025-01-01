import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Plus, RefreshCw, Search, StepBack, Trash2 } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import CardDetails from "./CardDetails"
import { useNavigate } from "react-router-dom"

interface Stock {
  id: string
  name: string
  ticker: string
  quantity: number
  buyPrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercentage: number
}


function StockPortfolioTable() {

  const navigate = useNavigate();

  const [stocks, setStocks] = useState<Stock[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ buyPrice, setBuyPrice ] = useState<number>(0)
  const [ quantity, setQuantity ] = useState<number>(0)
  const [ searchTerm, setSearchTerm ] = useState<string>('')
  const [ searchedStocks, setSearchedStocks ] = useState<Stock[]>([])
  const [ isSearching, setIsSearching ] = useState<boolean>(false)


  const updateStockValues = async (data : Stock[]) => {
    let pullCall : boolean;
    const updatedStocks = data.map(async (stock : Stock) => {
      const currentPrice : number = await getStockPrice(stock.ticker);

      if( stock.currentPrice !== currentPrice ) { pullCall = true }

      const totalValue : number = stock.quantity * currentPrice;
      const profitLoss : number = totalValue - ( stock.quantity * stock.buyPrice );
      const profitLossPercentage = ((totalValue - stock.quantity * stock.buyPrice) / (stock.quantity * stock.buyPrice)) * 100;

      if( pullCall === true ){
        handlePutRequest({
          id: stock.id,
          name: stock.name,
          ticker: stock.ticker,
          quantity: stock.quantity,
          buyPrice: stock.buyPrice,
          currentPrice: currentPrice,
          totalValue: totalValue,
          profitLoss: profitLoss,
          profitLossPercentage: profitLossPercentage
        })
        pullCall = false;
      }

      return {
        ...stock,
        currentPrice,
        totalValue,
        profitLoss,
        profitLossPercentage
      }
    })
    setStocks(await Promise.all(updatedStocks))
  }

  const handleRefresh = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }
    , 2000)
    updateStockValues(stocks)
  }

  const handlePutRequest = async (stock : Stock) => {
    fetch(`https://hospitable-warmth-backend.up.railway.app/api/stocks/${stock.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stock)
    })
  }

  const getStocks = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }
    , 2000)
    const response = await fetch(`https://hospitable-warmth-backend.up.railway.app/api/stocks`)
    const data = await response.json()
    updateStockValues(data);
    
  }

  const deleteStock = async (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id))    
    await fetch(`https://hospitable-warmth-backend.up.railway.app/api/stocks/${id}`, {
      method: 'DELETE'
    })
  }

  const getStockPrice = async (ticker: string) => {
    setLoading(true)
    const response = await fetch(`https://hospitable-warmth-backend.up.railway.app/api/stocks/${ticker}/price`)
    const data = await response.json()
    setLoading(false)
    return data.c
  }

  useEffect(() => {
    getStocks()
  }, [])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSearch = async () => {
    setIsSearching(true)
    const newStocks = stocks.filter(stock => stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    setSearchedStocks(newStocks)
  }

  const handleCheckboxChange = (invoice: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoice)
        ? prev.filter((i) => i !== invoice)
        : [...prev, invoice]
    )
  }

  const handleSelectAll = () => {
    if (selectedInvoices.length === stocks.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(stocks.map((invoice) => invoice.id))
    }
  }

  const handleDelete = (id: string) => {
    deleteStock(id)
    setStocks(stocks.filter(stock => stock.id !== id))
  }

  const handleSave = async (id: string) => {
    updateStockValues(stocks)
    
    const stock = stocks.find(stock => stock.id === id)

    const sendingData = {
      name: stock?.name,
      ticker: stock?.ticker,
      quantity: quantity === 0 ? stock?.quantity : quantity,
      buyPrice: buyPrice === 0 ? stock?.buyPrice : buyPrice
    }

    const rtn = await fetch(`https://hospitable-warmth-backend.up.railway.app/api/stocks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendingData)
    })

    await rtn.json()

    setBuyPrice(0)
    setQuantity(0)
    setEditingId(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof Stock) => {
    const value = Number(e.target.value);
    setStocks(stocks.map(stock => {
      if (stock.id === id) {
        return {
          ...stock,
          [field]: value
        }
      }
      return stock
    }
    ))
  }

  const handleSelectedDelete = () => {
    selectedInvoices.forEach((id) => {
      handleDelete(id)
    })
    setSelectedInvoices([])
  }


  return (
    <>  
      <h2 className="text-center mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Stats for your Stock Portfolio
      </h2>
      <CardDetails/>
      <div className="space-y-4">
        <h2 className="text-center mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Current Stats for your Stock Portfolio
        </h2>
        <div className="flex justify-center items-center space-x-2">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {
            !isSearching ? (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleSearch()}
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => (setIsSearching(false), setSearchTerm(''))}
              >
                <StepBack className="h-5 w-5" />
              </Button>
            )
          }
          <Button variant="outline" size="icon"
            onClick={() => navigate('/addStocks')} 
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon"
              onClick={() => handleRefresh()}
            >
            <RefreshCw 
              className="h-5 w-5"
            />
          </Button>
          {
            selectedInvoices.length > 0 && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleSelectedDelete()}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )
          }
        </div>
        <Table>
          <TableCaption>Your Stock Portfolio</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedInvoices.length === stocks.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Stock Name</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buy Price</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Profit/Loss</TableHead>
              <TableHead>Profit/Loss %</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            { loading ? 
            <>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6"/>
                </TableCell>
              </TableRow>
            </>
            : (
              isSearching ? 
              searchedStocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(stock.ticker)}
                      onCheckedChange={() => handleCheckboxChange(stock.ticker)}
                    />
                  </TableCell>
                  <TableCell>
                    {stock.name}
                  </TableCell>
                  <TableCell>
                    {stock.ticker}
                  </TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Input 
                        type="number" 
                        value={stock.quantity} 
                        onChange={(e) => handleInputChange(e, stock.id, 'quantity')}
                        className="w-20"
                      />
                    ) : stock.quantity}
                  </TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Input 
                        type="number" 
                        value={stock.buyPrice}
                        onChange={(e) => handleInputChange(e, stock.id, 'buyPrice')}
                        className="w-20"
                      />
                    ) : `$${stock.buyPrice.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {`$${stock.currentPrice.toFixed(2)}`}
                  </TableCell>
                  <TableCell>${stock.totalValue.toFixed(2)}</TableCell>
                  <TableCell
                    className={`${stock.profitLoss < 0 ? "text-red-700" : "text-blue-700"}`} 
                  >{stock.profitLoss < 0 ? `-$${(stock.profitLoss*-1).toFixed(2)}` : `$${(stock.profitLoss).toFixed(2)}`}</TableCell>
                  <TableCell
                    className={`${stock.profitLossPercentage < 0 ? "text-red-700" : "text-blue-700"}`} 
                  >{stock.profitLossPercentage < 0 ? `-${(stock.profitLossPercentage*-1).toFixed(2)}` : `${(stock.profitLossPercentage).toFixed(2)}`}%</TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Button onClick={() => handleSave(stock.id)}>Save</Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(stock.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(stock.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
              :
              stocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(stock.id)}
                      onCheckedChange={() => handleCheckboxChange(stock.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {stock.name}
                  </TableCell>
                  <TableCell>
                    {stock.ticker}
                  </TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Input 
                        type="number" 
                        value={stock.quantity} 
                        onChange={(e) => handleInputChange(e, stock.id, 'quantity')}
                        className="w-20"
                      />
                    ) : stock.quantity}
                  </TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Input 
                        type="number" 
                        value={stock.buyPrice}
                        onChange={(e) => handleInputChange(e, stock.id, 'buyPrice')}
                        className="w-20"
                      />
                    ) : `$${stock.buyPrice.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {`$${stock.currentPrice.toFixed(2)}`}
                  </TableCell>
                  <TableCell>${stock.totalValue.toFixed(2)}</TableCell>
                  <TableCell
                    className={`${stock.profitLoss < 0 ? "text-red-700" : "text-blue-700"}`} 
                  >{stock.profitLoss < 0 ? `-$${(stock.profitLoss*-1).toFixed(2)}` : `$${(stock.profitLoss).toFixed(2)}`}</TableCell>
                  <TableCell
                    className={`${stock.profitLossPercentage < 0 ? "text-red-700" : "text-blue-700"}`} 
                  >{stock.profitLossPercentage < 0 ? `-${(stock.profitLossPercentage*-1).toFixed(2)}` : `${(stock.profitLossPercentage).toFixed(2)}`}%</TableCell>
                  <TableCell>
                    {editingId === stock.id ? (
                      <Button onClick={() => handleSave(stock.id)}>Save</Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(stock.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(stock.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )
          }
          </TableBody>
        </Table>
      </div>
    </>
    
  )
}

export default StockPortfolioTable;