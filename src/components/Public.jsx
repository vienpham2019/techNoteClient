import { Link } from "react-router-dom";

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Hello to <span className="nowrap">Dan D. Repairs!</span></h1>
            </header>
            <main className="public_main">
                <p>
                    Located in Beautiful Downtown Foo City, Dan D. Repairs provides a trained staff ready to meet you tech repair needs.
                </p>
                <address className="public__addr">
                    Dan D. Repaisrs <br />
                    555 foo drive <br />
                    Foo City, CA 12345 <br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
                <p>Owner: Dan Davidson</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>
    );
    return content;
}

export default Public; 