// src/__tests__/app.jsx
import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import App from '../app'

describe('Integration tests for Multi-Page Form', () => {
  test('Parcours passant : de la Home au succès', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    // Home
    expect(
      screen.getByRole('heading', {name: /Welcome home/i}),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Fill out the form/i))

    // Page 1
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Page 1/i}),
      ).toBeInTheDocument(),
    )
    const foodInput = screen.getByLabelText(/Favorite Food/i)
    fireEvent.change(foodInput, {target: {value: 'Les pâtes'}})
    fireEvent.click(screen.getByText(/Next/i))

    // Page 2
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Page 2/i}),
      ).toBeInTheDocument(),
    )
    const drinkInput = screen.getByLabelText(/Favorite Drink/i)
    fireEvent.change(drinkInput, {target: {value: 'Bière'}})
    fireEvent.click(screen.getByText(/Review/i))

    // Confirmation
    await waitFor(() =>
      expect(
        screen.getByText(/Please confirm your choices/i),
      ).toBeInTheDocument(),
    )
    expect(screen.getByText('Les pâtes')).toBeInTheDocument()
    expect(screen.getByText('Bière')).toBeInTheDocument()
    const confirmButton = screen.getByRole('button', {name: /Confirm/i})
    fireEvent.click(confirmButton)

    // Succès
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Congrats. You did it./i}),
      ).toBeInTheDocument(),
    )
    fireEvent.click(screen.getByText(/Go home/i))
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Welcome home/i}),
      ).toBeInTheDocument(),
    )
  })

  test('Parcours non passant : erreur renvoyée quand le champ "Favorite Food" est vide', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    // Home
    expect(
      screen.getByRole('heading', {name: /Welcome home/i}),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Fill out the form/i))

    // Page 1
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Page 1/i}),
      ).toBeInTheDocument(),
    )
    const foodInput = screen.getByLabelText(/Favorite Food/i)
    fireEvent.change(foodInput, {target: {value: ''}})
    fireEvent.click(screen.getByText(/Next/i))

    // Page 2
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Page 2/i}),
      ).toBeInTheDocument(),
    )
    const drinkInput = screen.getByLabelText(/Favorite Drink/i)
    fireEvent.change(drinkInput, {target: {value: 'Bière'}})
    fireEvent.click(screen.getByText(/Review/i))

    // Confirmation
    await waitFor(() =>
      expect(
        screen.getByText(/Please confirm your choices/i),
      ).toBeInTheDocument(),
    )
    const confirmButton = screen.getByRole('button', {name: /Confirm/i})
    fireEvent.click(confirmButton)

    // Page d'erreur
    await waitFor(() =>
      expect(
        screen.getByText(/Oh no. There was an error./i),
      ).toBeInTheDocument(),
    )
    expect(
      screen.getByText(/les champs food et drink sont obligatoires/i),
    ).toBeInTheDocument()

    // try again
    fireEvent.click(screen.getByText(/Try again/i))
    await waitFor(() =>
      expect(
        screen.getByRole('heading', {name: /Page 1/i}),
      ).toBeInTheDocument(),
    )
  })
})
