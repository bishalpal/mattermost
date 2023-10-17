// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {AllowedIPRange} from '@mattermost/types/config';

import {isIPAddressInRanges} from './ip_filtering_utils';

describe('isIPAddressInRanges', () => {
    const allowedIPRanges = [
        {
            CIDRBlock: '192.168.0.0/24',
            Description: 'Test Filter',
        },
        {
            CIDRBlock: '10.1.0.0/16',
            Description: 'Test Filter 2',
        },
        {
            CIDRBlock: '172.16.0.0/12',
            Description: 'Test Filter 3',
        },
        {
            CIDRBlock: '2001:db8::/32',
            Description: 'Test Filter 4',
        },
        {
            CIDRBlock: 'fe80::/10',
            Description: 'Test Filter 5',
        },
    ] as AllowedIPRange[];

    test('returns true if the IPv4 address is within an allowed IP range', () => {
        expect(isIPAddressInRanges('192.168.0.1', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('10.1.0.1', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('172.16.0.1', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('172.31.255.255', allowedIPRanges)).toBe(true);
    });

    test('returns false if the IPv4 address is not within an allowed IP range', () => {
        expect(isIPAddressInRanges('192.168.1.1', allowedIPRanges)).toBe(false);
        expect(isIPAddressInRanges('172.15.255.255', allowedIPRanges)).toBe(false);
        expect(isIPAddressInRanges('172.32.0.1', allowedIPRanges)).toBe(false);
        expect(isIPAddressInRanges('10.0.55.8', allowedIPRanges)).toBe(false);
    });

    test('returns true if the IPv6 address is within an allowed IP range', () => {
        expect(isIPAddressInRanges('2001:db8::1', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('fe80::1', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('2001:db8:1234:5678::abcd', allowedIPRanges)).toBe(true);
        expect(isIPAddressInRanges('fe80::1234:5678:abcd:ef01:', allowedIPRanges)).toBe(true);
    });

    test('returns false if the IPv6 address is not within an allowed IP range', () => {
        expect(isIPAddressInRanges('fe80::1234:5678:abcd:ef02', allowedIPRanges)).toBe(false);
    });
});