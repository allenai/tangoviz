import { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

/**
 * Copied in form Varnish until varnish fixes itself: allenai/varnish#543
 *
 * Use this component inside a top-level <Route /> handler when you'd like
 * the page to be scrolled to the top after a URL change.
 */
const ScrollToTopOnPageChangeImpl = ({ history }: RouteComponentProps) => {
    useEffect(() =>
        history.listen(() => {
            window.scrollTo(0, 0);
        })
    );
    return null;
};

export const ScrollToTopOnPageChange = withRouter(ScrollToTopOnPageChangeImpl);
