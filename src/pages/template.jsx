import React from 'react'

const GenericPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <section className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Page Title</h1>
          <p className="text-gray-600 mt-2">Optional subtitle or description goes here.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Section Title</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...
          </p>

          {/* Example content area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">Content Block 1</div>
            <div className="bg-gray-100 p-4 rounded-lg">Content Block 2</div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default GenericPage
