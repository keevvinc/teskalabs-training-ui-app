import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';
import { DataTableCard2 } from 'asab_webui_components';

export function BreedsScreen(props) {
	const { t } = useTranslation();
	const [selectedBreed, setSelectedBreed] = useState(null);

	const DogAPI = useMemo(() => props.app.axiosCreate('dogapi'), []); // eslint-disable-line react-hooks/exhaustive-deps — props.app is a stable singleton

	const loader = useCallback(async ({ params }) => {
		const { p = 1, i = 20 } = params;

		try {
			const response = await DogAPI.get('/breeds', { params: { page: Number(p) - 1, limit: Number(i) } });
			return { rows: response.data, count: Number(response.headers['pagination-count']) };
		} catch (e) {
			props.app.addAlertFromException(e, t('Training|Failed to load breeds'));
			return { rows: [], count: 0 };
		}
	}, [DogAPI, t]);

	const columns = useMemo(() => [
		{
			title: '',
			colStyle: { width: '56px' },
			render: ({ row }) =>
				row.image?.url ? (
					<button className="btn btn-link p-0" onClick={() => setSelectedBreed(row)}>
						<img
							src={row.image.url}
							alt={row.name}
							width={40}
							height={40}
							style={{ objectFit: 'cover', borderRadius: '6px' }}
						/>
					</button>
				) : (
					<span className="text-muted">
						<i className="bi bi-image fs-4" />
					</span>
				),
		},
		{
			title: t('Training|Name'),
			render: ({ row }) => (
				<button className="btn btn-link p-0" onClick={() => setSelectedBreed(row)}>
					{row.name}
				</button>
			),
		},
		{
			title: t('Training|Breed Group'),
			render: ({ row }) => row.breed_group || <span className="text-muted">—</span>,
		},
		{
			title: t('Training|Origin'),
			render: ({ row }) => row.origin || <span className="text-muted">—</span>,
		},
		{
			title: t('Training|Life Span'),
			render: ({ row }) => row.life_span,
		},
		{
			title: t('Training|Weight'),
			render: ({ row }) =>
				row.weight?.imperial ? `${row.weight.imperial} lbs` : <span className="text-muted">—</span>,
		},
		{
			title: t('Training|Temperament'),
			render: ({ row }) => row.temperament
				? <span className="text-truncate d-block" style={{ maxWidth: '260px' }}>{row.temperament}</span>
				: <span className="text-muted">—</span>,
		},
	], [t]);

	return (
		<Container fluid className="h-100">
			<DataTableCard2
				columns={columns}
				loader={loader}
				header={
					<div className="flex-fill">
						<h3>
							<i className="bi bi-heart pe-2" />
							{t('Training|Breeds')}
						</h3>
					</div>
				}
			/>

			<Modal isOpen={!!selectedBreed} toggle={() => setSelectedBreed(null)} size="lg" centered>
				<ModalHeader toggle={() => setSelectedBreed(null)}>
					{selectedBreed?.name}
				</ModalHeader>
				<ModalBody>
					<Row>
						{selectedBreed?.image?.url && (
							<Col md={5} className="mb-3 mb-md-0">
								<img
									src={selectedBreed.image.url}
									alt={selectedBreed.name}
									style={{ width: '100%', objectFit: 'cover', borderRadius: '6px' }}
								/>
							</Col>
						)}
						<Col md={selectedBreed?.image?.url ? 7 : 12}>
							<dl className="mb-0">
								{selectedBreed?.breed_group && <>
									<dt>{t('Training|Breed Group')}</dt>
									<dd>{selectedBreed.breed_group}</dd>
								</>}
								{selectedBreed?.origin && <>
									<dt>{t('Training|Origin')}</dt>
									<dd>{selectedBreed.origin}</dd>
								</>}
								{selectedBreed?.life_span && <>
									<dt>{t('Training|Life Span')}</dt>
									<dd>{selectedBreed.life_span}</dd>
								</>}
								{selectedBreed?.weight?.imperial && <>
									<dt>{t('Training|Weight')}</dt>
									<dd>{selectedBreed.weight.imperial} lbs</dd>
								</>}
								{selectedBreed?.temperament && <>
									<dt>{t('Training|Temperament')}</dt>
									<dd>{selectedBreed.temperament}</dd>
								</>}
							</dl>
						</Col>
					</Row>
				</ModalBody>
			</Modal>
		</Container>
	);
}
