import axios from 'axios';
import https from 'https';
import { addBidding } from '../server/data/biddings';

export const parseBiddings = () => {
    axios({
        method: 'post',
        url: 'https://api.market.mosreg.ru/api/Trade/GetTradesForParticipantOrAnonymous',
        data: {
            CustomerAddress: '',
            CustomerFullNameOrInn: '',
            FilterFillingApplicationEndDateTo: null,
            IsImmediate: false,
            OnlyTradesWithMyApplications: false,
            ParticipantHasApplicationsOnTrade: '',
            ProductPriceMax: '',
            ProductPriceMin: '',
            SourcePlatform: 10,
            UsedClassificatorType: 10,
            classificatorCodes: [],
            filterDateFrom: null,
            filterDateTo: null,
            filterFillingApplicationEndDateFrom: null,
            filterPriceMax: '',
            filterPriceMin: '',
            filterTradeEasuzNumber: '',
            itemsPerPage: 3000,
            page: 1,
            showApprovementTrades: false,
            showOnlyOwnTrades: false,
            sortingParams: [],
            tradeState: '15',
        },
        httpsAgent: new https.Agent({ // Отключаем проверку https
            rejectUnauthorized: false,
        }),
    }).then((response) => {
        const biddingsArray = response.data.invdata;
        console.log(biddingsArray);
        biddingsArray.forEach((bidding) => {
            addBidding({
                id: `МО-223-${bidding.Id}`,
                name: bidding.TradeName,
                priceStart: bidding.InitialPrice,
                url: `https://market.mosreg.ru/Trade/ViewTrade/${bidding.Id}`,
                customer: bidding.CustomerFullName,
                dateStart: Date.parse(bidding.PublicationDate),
                dateEnd: Date.parse(bidding.FillingApplicationEndDate),
                customerId: bidding.OrganizationId,
            });
        });
    })
        .catch((err) => {
            console.error(err);
        });
};
