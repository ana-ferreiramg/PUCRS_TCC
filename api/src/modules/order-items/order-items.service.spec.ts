import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsRepository } from '@shared/database/repositories/orderItems.repositories';
import { ProductsRepository } from '@shared/database/repositories/products.repositories';
import { OrderItemsService } from './order-items.service';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let orderItemsRepo: Partial<Record<keyof OrderItemsRepository, jest.Mock>>;
  let productsRepo: Partial<Record<keyof ProductsRepository, jest.Mock>>;

  beforeEach(async () => {
    orderItemsRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeManyByOrderId: jest.fn(),
    };

    productsRepo = {
      findUnique: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        { provide: OrderItemsRepository, useValue: orderItemsRepo },
        { provide: ProductsRepository, useValue: productsRepo },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const orderId = 'order-123';
    const createDto = { productId: 'prod-123', quantity: 2 };
    const product = { id: 'prod-123', price: 100 };

    it('should create order item successfully', async () => {
      productsRepo.findUnique!.mockResolvedValue(product);
      orderItemsRepo.create!.mockResolvedValue({
        id: 'item-1',
        orderId,
        productId: createDto.productId,
        quantity: createDto.quantity,
        price: product.price,
      });

      const result = await service.create(createDto, orderId);

      expect(productsRepo.findUnique).toHaveBeenCalledWith({
        where: { id: createDto.productId },
      });
      expect(orderItemsRepo.create).toHaveBeenCalledWith({
        data: {
          orderId,
          productId: createDto.productId,
          quantity: createDto.quantity,
          price: product.price,
        },
      });
      expect(result.price).toBe(product.price);
    });

    it('should throw HttpException if product not found', async () => {
      productsRepo.findUnique!.mockResolvedValue(null);

      await expect(service.create(createDto, orderId)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException on repository error', async () => {
      productsRepo.findUnique!.mockRejectedValue(new Error('DB failure'));

      await expect(service.create(createDto, orderId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all order items', async () => {
      const items = [{ id: 'item-1' }, { id: 'item-2' }];
      orderItemsRepo.findAll!.mockResolvedValue(items);

      const result = await service.findAll();

      expect(orderItemsRepo.findAll).toHaveBeenCalledWith({});
      expect(result).toBe(items);
    });

    it('should throw HttpException on error', async () => {
      orderItemsRepo.findAll!.mockRejectedValue(new Error('DB failure'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    const id = 'item-1';

    it('should return order item when found', async () => {
      const item = { id };
      orderItemsRepo.findUnique!.mockResolvedValue(item);

      const result = await service.findOne(id);

      expect(orderItemsRepo.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(item);
    });

    it('should throw HttpException 404 if item not found', async () => {
      orderItemsRepo.findUnique!.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException on error', async () => {
      orderItemsRepo.findUnique!.mockRejectedValue(new Error('DB failure'));

      await expect(service.findOne(id)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    const id = 'item-1';
    const updateDto = { id: 'update-123', productId: 'prod-123', quantity: 3 };
    const product = { id: 'prod-123', price: 150 };
    const updatedItem = { id, ...updateDto, price: product.price };

    it('should update and return order item', async () => {
      productsRepo.findUnique!.mockResolvedValue(product);
      orderItemsRepo.update!.mockResolvedValue(updatedItem);

      const result = await service.update(id, updateDto);

      expect(productsRepo.findUnique).toHaveBeenCalledWith({
        where: { id: updateDto.productId },
      });
      expect(orderItemsRepo.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          quantity: updateDto.quantity,
          price: product.price,
          productId: updateDto.productId,
        },
      });
      expect(result).toBe(updatedItem);
    });

    it('should throw 404 if product not found', async () => {
      productsRepo.findUnique!.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw 404 if item to update not found', async () => {
      productsRepo.findUnique!.mockResolvedValue(product);
      orderItemsRepo.update!.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException on error', async () => {
      productsRepo.findUnique!.mockResolvedValue(product);
      orderItemsRepo.update!.mockRejectedValue(new Error('DB failure'));

      await expect(service.update(id, updateDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('remove', () => {
    const id = 'item-1';
    const deletedItem = { id };

    it('should remove and return deleted item', async () => {
      orderItemsRepo.remove!.mockResolvedValue(deletedItem);

      const result = await service.remove(id);

      expect(orderItemsRepo.remove).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(deletedItem);
    });

    it('should throw 404 if item not found', async () => {
      orderItemsRepo.remove!.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException on error', async () => {
      orderItemsRepo.remove!.mockRejectedValue(new Error('DB failure'));

      await expect(service.remove(id)).rejects.toThrow(HttpException);
    });
  });

  describe('removeManyByOrderId', () => {
    const orderId = 'order-123';

    it('should remove many items and return success message', async () => {
      orderItemsRepo.removeManyByOrderId!.mockResolvedValue(undefined);

      const result = await service.removeManyByOrderId(orderId);

      expect(orderItemsRepo.removeManyByOrderId).toHaveBeenCalledWith(orderId);
      expect(result).toBe(
        `Itens da ordem com ID ${orderId} deletados com sucesso.`,
      );
    });

    it('should throw HttpException on error', async () => {
      orderItemsRepo.removeManyByOrderId!.mockRejectedValue(
        new Error('DB failure'),
      );

      await expect(service.removeManyByOrderId(orderId)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
