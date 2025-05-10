import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import TourViewer from './Components/Common/TourViewer';

document.addEventListener('DOMContentLoaded', () => {
	const blockNameEls = document.querySelectorAll('.wp-block-b-blocks-pin-creator');
	blockNameEls.forEach(blockNameEl => {
		const attributes = JSON.parse(blockNameEl.dataset.attributes);

		createRoot(blockNameEl).render(<>
			<Style attributes={attributes} id={blockNameEl.id} />
			
			<TourViewer {...{ attributes }} />

		</>);

		blockNameEl?.removeAttribute('data-attributes');
	});
});