import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';
import { Container, Card, CardHeader, CardBody, Row, Col, Spinner } from 'reactstrap';
import { DateTime } from 'asab_webui_components';

export function DetailScreen(props) {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const DataAPI = useMemo(() => props.app.axiosCreate('devtest'), []); // props.app is a stable singleton

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError(false);

		async function fetchDetail() {
			try {
				const res = await DataAPI.get(`/detail/${id}`, { signal: controller.signal });
				setData(res.data);
			} catch (e) {
				if (!controller.signal.aborted) {
					setError(true);
					props.app.addAlertFromException(e, t('Training|Failed to load detail'));
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		}

		fetchDetail();
		return () => controller.abort();
	}, [id, DataAPI]); // eslint-disable-line react-hooks/exhaustive-deps — t and props.app are stable references

	return (
		<Container className="mt-3">
			<button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/')}>
				<i className="bi bi-arrow-left pe-2" />
				{t('Training|Back to Table')}
			</button>

			{loading ? (
				<div className="d-flex justify-content-center mt-5">
					<Spinner />
				</div>
			) : error ? (
				<p className="text-muted">{t('Training|Failed to load detail')}</p>
			) : (
				<Card>
					<CardHeader className="card-header-flex">
						<div className="flex-fill">
							<h3>
								<i className="bi bi-person pe-2" />
								{data.username}
							</h3>
						</div>
					</CardHeader>
					<CardBody>
						<Row>
							<Col md={6}>
								<dl>
									<dt><i className="bi bi-fingerprint pe-1" />{t('Training|ID')}</dt>
									<dd className="text-muted font-monospace">{data.id}</dd>

									<dt><i className="bi bi-envelope pe-1" />{t('Training|Email')}</dt>
									<dd>{data.email}</dd>

									<dt><i className="bi bi-geo-alt pe-1" />{t('Training|Address')}</dt>
									<dd>{data.address}</dd>

									<dt><i className="bi bi-telephone pe-1" />{t('Training|Phone')}</dt>
									<dd>{data.phone_number}</dd>
								</dl>
							</Col>
							<Col md={6}>
								<dl>
									<dt><i className="bi bi-hdd-network pe-1" />{t('Training|IP Address')}</dt>
									<dd className="font-monospace">{data.ip_address}</dd>

									<dt><i className="bi bi-ethernet pe-1" />{t('Training|MAC Address')}</dt>
									<dd className="font-monospace">{data.mac_address}</dd>

									<dt><i className="bi bi-calendar-plus pe-1" />{t('Training|Created')}</dt>
									<dd><DateTime value={data.created} /></dd>

									<dt><i className="bi bi-clock-history pe-1" />{t('Training|Last Sign In')}</dt>
									<dd><DateTime value={data.last_sign_in} /></dd>
								</dl>
							</Col>
						</Row>
					</CardBody>
				</Card>
			)}
		</Container>
	);
}
