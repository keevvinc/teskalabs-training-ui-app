import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Container } from 'reactstrap';
import { DataTableCard2, DateTime } from 'asab_webui_components';

export function TableScreen(props) {
	const { t } = useTranslation();

	const DataAPI = useMemo(() => props.app.axiosCreate('devtest'), []); // eslint-disable-line react-hooks/exhaustive-deps — props.app is a stable singleton

	const loader = useCallback(async ({ params }) => {
		const { p = 1, i = 20 } = params;

		try {
			const response = await DataAPI.get('/data', { params: { p, i } });
			return { rows: response.data.data, count: response.data.count };
		} catch (e) {
			props.app.addAlertFromException(e, t('Training|Failed to load data'));
			return { rows: [], count: 0 };
		}
	}, [DataAPI, t]);

	const columns = useMemo(() => [
		{
			title: t('Training|Username'),
			render: ({ row }) => (
				<Link to={`/detail/${row.id}`} title={row.id}>
					{row.username}
				</Link>
			),
		},
		{
			title: t('Training|Email'),
			render: ({ row }) => row.email,
		},
		{
			title: t('Training|Address'),
			render: ({ row }) => row.address,
		},
		{
			title: t('Training|Created'),
			render: ({ row }) => <DateTime value={row.created} />,
		},
		{
			title: t('Training|Last Sign In'),
			render: ({ row }) => <DateTime value={row.last_sign_in} />,
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
							<i className="bi bi-people pe-2" />
							{t('Training|Users')}
						</h3>
					</div>
				}
			/>
		</Container>
	);
}
