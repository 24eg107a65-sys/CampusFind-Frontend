import { useState, useEffect } from 'react'
import "./App.css";

function App() {
    console.log('CAMPUSFIND TEST 123');
    const [activeTab, setActiveTab] = useState('All Items')
    const [search, setSearch] = useState('')


    const [items, setItems] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'Lost',
        location: '',
        contactInfo: ''
    })

    const [message, setMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage('')

        try {
            const response = await fetch('http://localhost:8081/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    dateReported: new Date().toISOString().split('T')[0]
                })
            })

            if (!response.ok) {
                throw new Error('Could not submit the report')
            }

            const newItem = await response.json()

            setItems((previousItems) => [...previousItems, newItem])

            setFormData({
                title: '',
                description: '',
                category: '',
                type: 'Lost',
                location: '',
                contactInfo: ''
            })

            setMessage('Report submitted successfully!')
        } catch (error) {
            setMessage('Could not submit the report. Please try again.')
            console.error(error)
        }
    }


    useEffect(() => {
        fetch('http://localhost:8081/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('Error loading items:', error))
    }, [])


    const filteredItems = items.filter((item) => {
        const matchesTab = activeTab === 'All Items' || item.type === activeTab
        const matchesSearch = `${item.title} ${item.category} ${item.location}`
            .toLowerCase()
            .includes(search.toLowerCase())
        return matchesTab && matchesSearch
    })

    return (
        <div className="app">
            <header className="navbar">
                <a className="brand" href="#home"><span>🔎</span> CampusFind</a>
                <nav>
                    <a href="#home">Home</a>
                    <a href="#items">Browse Items</a>
                    <a href="#report">Report an Item</a>
                </nav>
                <a className="nav-button" href="#report">＋ Report Item</a>
            </header>

            <main>
                <section className="hero" id="home">
                    <div className="hero-content">
                        <span className="eyebrow">YOUR CAMPUS, CONNECTED</span>
                        <h1>Lost something?<br /><span>Let's find it together.</span></h1>
                        <p>A simple, reliable place for students to report lost belongings and reunite found items with their owners.</p>
                        <div className="hero-actions">
                            <a className="primary-button" href="#items">Browse Items →</a>
                            <a className="secondary-button" href="#report">Report an Item</a>
                        </div>
                        <div className="trust-note">🎓 Made for your campus community</div>
                    </div>
                    <div className="hero-art" aria-label="Illustration of lost and found belongings">
                        <div className="art-circle"></div>
                        <div className="floating-card card-one">🎒 <span>Backpack</span></div>
                        <div className="floating-card card-two">🔑 <span>Keys</span></div>
                        <div className="illustration-bag">🎒</div>
                        <div className="art-caption">Every item has a way home.</div>
                    </div>
                </section>

                <section className="items-section" id="items">
                    <div className="section-heading">
                        <div>
                            <span className="eyebrow">THE CAMPUS COMMUNITY</span>
                            <h2>Lost & Found Board</h2>
                            <p>Browse recent reports from around your campus.</p>
                        </div>
                        <a className="text-link" href="#report">Have an item to report? →</a>
                    </div>

                    <div className="item-tools">
                        <div className="tabs">
                            {['All Items', 'Lost', 'Found'].map((tab) => (
                                <button
                                    key={tab}
                                    className={activeTab === tab ? 'tab active' : 'tab'}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <input
                            className="search-input"
                            type="search"
                            placeholder="Search items or locations..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className="item-grid">
                        {filteredItems.map((item) => (
                            <article className="item-card" key={item.id}>
                                <div className={`item-visual visual-${item.id}`}>
                                    <span className={`status ${item.type.toLowerCase()}`}>{item.type}</span>
                                    <span className="item-emoji">
                                        {item.category === 'Bags' ? '🎒' : item.category === 'ID Cards' ? '🪪' : '🧴'}
                                    </span>
                                </div>
                                <div className="item-details">
                                    <span className="item-category">{item.category}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <div className="item-meta">
                                        <span>📍 {item.location}</span>
                                        <span>📅 {item.date}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {filteredItems.length === 0 && (
                            <p className="empty-message">No matching items found. Try another search.</p>
                        )}
                    </div>
                    <p className="demo-note">Sample items for the initial design — we'll connect real reports to your database next.</p>
                </section>


                <section className="report-section" id="report">
                    <div>
                        <span className="eyebrow">HELP SOMEONE FIND THEIR BELONGINGS</span>
                        <h2>Found something?<br />Lost something?</h2>
                        <p>
                            Every report helps our campus community return belongings to the right person.
                        </p>
                    </div>

                    <form className="report-form" onSubmit={handleSubmit}>
                        <h3>TEST FORM</h3>

                        <label>
                            Item Name
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. Black backpack"
                            />
                        </label>

                        <label>
                            Report Type
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Lost">I lost something</option>
                                <option value="Found">I found something</option>
                            </select>
                        </label>

                        <label>
                            Category
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Choose a category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Bags">Bags</option>
                                <option value="ID Cards">ID Cards</option>
                                <option value="Books">Books</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>

                        <label>
                            Description
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Describe the item"
                            />
                        </label>

                        <label>
                            Location
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Where was it lost or found?"
                            />
                        </label>

                        <label>
                            Contact Information
                            <input
                                type="text"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                required
                                placeholder="Email or phone"
                            />
                        </label>

                        <button className="primary-button" type="submit">
                            Submit Report →
                        </button>

                        {message && <p role="status">{message}</p>}
                    </form>
                </section>

                <footer>
                    <a className="brand" href="#home">🔎 CampusFind</a>
                    <p>Making campus life a little less stressful.</p>
                    <span>© 2026 CampusFind · College Lost & Found</span>
                </footer>
            </main>
        </div>
    )
}

export default App

