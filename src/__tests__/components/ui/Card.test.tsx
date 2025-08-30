import { render, screen } from "@testing-library/react"
import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

describe('Card Components', () => {
  test('renders card with all sections', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Test Content</p>
        </CardContent>
        <CardFooter>
          <button>Test Footer</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Test Footer' })).toBeInTheDocument()
  })

  test('applies custom className', () => {
    render(<Card className="custom-class" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
  })

  test('renders minimal card structure', () => {
    render(
      <Card data-testid="minimal-card">
        <CardContent>Minimal content</CardContent>
      </Card>
    )

    expect(screen.getByTestId('minimal-card')).toBeInTheDocument()
    expect(screen.getByText('Minimal content')).toBeInTheDocument()
  })
})